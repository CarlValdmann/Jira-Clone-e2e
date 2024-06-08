describe("Tests for time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });
  const timeRemaining = '[placeholder="Number"]';
  const trackingTab = () => cy.get(".sc-CtfFt");
  const timeTracking = '[data-testid="icon:stopwatch"]';
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Open time tracking module", () => {
    getIssueDetailsModal().within(() => {
      cy.get(timeTracking).should("exist").click();
    });
    trackingTab().within(() => {
      cy.get(timeRemaining).should("have.value", 4);
    });
  });
});
