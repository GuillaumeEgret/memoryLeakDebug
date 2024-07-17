import { screen } from "@testing-library/react-native";

import Home from "#app/navigation";
import { renderWithProviders } from "#testing/render";

it("finds rendered text", async () => {
  renderWithProviders(<Home />);

  expect(
    await screen.findByText(/Welcome to the Joconde Bootstrap App/),
  ).toBeOnTheScreen();
});
