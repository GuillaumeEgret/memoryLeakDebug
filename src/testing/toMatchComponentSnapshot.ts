/* eslint-disable @typescript-eslint/ban-ts-comment */
import { toMatchSnapshot } from "jest-snapshot";
import { StyleSheet } from "react-native";
import type {
  ReactTestRendererJSON,
  ReactTestRendererNode,
} from "react-test-renderer";

const getImageSource = (node: ReactTestRendererJSON): string | null => {
  let imageSource = node.props.source;

  if (!imageSource) return null;

  // React Native Image views pass source as array while fast-image doesn't
  if (Array.isArray(imageSource) && imageSource.length > 0)
    imageSource = imageSource[0];

  return imageSource?.uri || imageSource?.testUri;
};

export const toText = (
  node: ReactTestRendererNode | null,
  textSeparator = "\n",
): string | null => {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node))
    return toText({ type: "Fragment", props: {}, children: node });

  const texts = [
    getImageSource(node),
    ...(node.children?.map((child) => toText(child, textSeparator)) || []),
  ].filter(truthy);

  return texts.length > 0
    ? texts.join(textSeparator) +
        // Arbitrarily add a separator if more than 1 child, just to add some space in the snap
        (texts.length > 1 ? textSeparator : "")
    : null;
};

const removeFunctionProps = (tree: ReactTestRendererJSON) => {
  const treeProps = { ...tree.props };
  Object.keys(treeProps).forEach((key) => {
    if (typeof treeProps[key] === "function") {
      delete treeProps[key];
    }
  });

  return treeProps;
};

const removeVirtualizedDataProps = (tree: ReactTestRendererJSON) => {
  const treeProps = { ...tree.props };

  if (treeProps.data) delete treeProps.data;
  if (treeProps.sections) delete treeProps.sections;
  if (treeProps.items) delete treeProps.items;

  return treeProps;
};

type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;
export const truthy = <T>(value: T): value is Truthy<T> => {
  return !!value;
};

const _smallSnapshot = (
  tree: ReactTestRendererNode | null,
): ReactTestRendererNode | null => {
  if (!tree || typeof tree === "string") return tree;

  const { children, props } = tree;

  if (props.style) tree.props.style = StyleSheet.flatten(props.style);
  if (props.contentContainerStyle)
    tree.props.contentContainerStyle = StyleSheet.flatten(
      props.contentContainerStyle,
    );

  tree.props = removeVirtualizedDataProps(tree);

  tree.props = removeFunctionProps(tree);

  if (children) {
    tree.children = children
      .map((child) => _smallSnapshot(child))
      .filter(truthy);
  }

  return tree;
};

export const smallSnapshot = (
  tree: ReactTestRendererNode | ReactTestRendererNode[] | null,
): ReactTestRendererNode | (ReactTestRendererNode | null)[] | null => {
  if (Array.isArray(tree)) return tree.map(_smallSnapshot);
  return _smallSnapshot(tree);
};

expect.extend({
  toMatchComponentSnapshot: function toMatchComponentSnapshot(received) {
    const tree = received.toJSON();
    /**
     * Getting a jest Argument of type 'MatcherContext' is not assignable to parameter of type 'Context'
     * That I couldn't solve
     */
    const textSnapshotResult = toMatchSnapshot.call(
      // @ts-ignore
      this,
      toText(tree),
    );

    // @ts-expect-error the result is typed as either an object or a promise
    // but it can't be a promise for this particular matcher
    if (!textSnapshotResult.pass) return textSnapshotResult;

    const componentSnapshotResult = toMatchSnapshot.call(
      // @ts-ignore
      this,
      smallSnapshot(received.toJSON()),
    );

    return componentSnapshotResult;
  },
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchComponentSnapshot(): R;
    }
  }
}
