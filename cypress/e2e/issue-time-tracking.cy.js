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
  const placeholder = '[placeholder="Number"]';
  const trackingTab = () => cy.get('[data-testid="modal:tracking"]');
  const timeTrackingPreview = '[class="sc-rBLzX irwmBe"]';
  const timeTracking = '[data-testid="icon:stopwatch"]';
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should open time tracking module, add an estimation, edit it and remove it later", () => {
    // Open timetracking
    getIssueDetailsModal().within(() => {
      cy.get(timeTracking).should("exist").click();
    });

    // Adding estimations
    trackingTab().within(() => {
      cy.get(placeholder).first().should("have.value", "4").clear().type("6");
      cy.get(placeholder)
        .eq(1)
        .should("have.attr", "placeholder", "Number")
        .type("8");
      cy.contains("button", "Done").click();
    });

    // Asserting that the added estimation is added and visible
    getIssueDetailsModal().within(() => {
      cy.get(timeTrackingPreview).should("exist");
      cy.wait(5000);
      cy.get(timeTrackingPreview).should("contain", "6h logged");
      cy.get(timeTrackingPreview).should("contain", "8h remaining");
    });

    // Open timetracking
    getIssueDetailsModal().within(() => {
      cy.get(timeTracking).should("exist").click();
    });

    // Editing the estimation
    trackingTab().within(() => {
      cy.get(placeholder).first().should("have.value", "6").clear().type("8");
      cy.get(placeholder).eq(1).should("have.value", "8").clear().type("9");
      cy.contains("button", "Done").click();
    });

    // Asserting that the updated estimation is added and visible
    getIssueDetailsModal().within(() => {
      cy.get(timeTrackingPreview).should("exist");
      cy.wait(5000);
      cy.get(timeTrackingPreview).should("contain", "8h logged");
      cy.get(timeTrackingPreview).should("contain", "9h remaining");
    });

    // Open timetracking
    getIssueDetailsModal().within(() => {
      cy.get(timeTracking).should("exist").click();
    });

    // Removing the estimation
    trackingTab().within(() => {
      cy.get(placeholder).first().should("have.value", "8").clear();
      cy.get(placeholder).eq(1).should("have.value", "9").clear();
      cy.contains("button", "Done").click();
    });

    // Assert that the value is removed
    getIssueDetailsModal().within(() => {
      cy.get(timeTrackingPreview).should("exist");
      cy.wait(5000);
      cy.get(timeTrackingPreview).should("contain", "No time logged");
    });
  });
});
