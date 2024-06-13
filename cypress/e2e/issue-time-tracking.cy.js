describe("Time tracking tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const placeholder = '[placeholder="Number"]';
  const closeButton = '[data-testid="icon:close"]';
  const trackingTab = () => cy.get('[data-testid="modal:tracking"]');
  const timeTrackingPreview = '[class="sc-rBLzX irwmBe"]';
  const timeTracking = '[data-testid="icon:stopwatch"]';
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  const openIssueDetails = () => {
    cy.contains("This is an issue of type: Task.").click();
  };

  const closeIssueDetails = () => {
    cy.get(closeButton).first().click();
  };

  it("Should be able to add, edit, and remove the estimation of an issue.", () => {
    getIssueDetailsModal().within(() => {
      cy.get(placeholder).first().clear().type("10");
      cy.log("Set estimation to 10");
      closeIssueDetails();
    });

    openIssueDetails();
    cy.get(placeholder).first().should("have.value", "10", { timeout: 10000 });

    closeIssueDetails();

    openIssueDetails();
    getIssueDetailsModal().within(() => {
      cy.get(placeholder).first().clear().type("20");
      cy.log("Set estimation to 20");
      cy.wait(5000);
      closeIssueDetails();
    });

    openIssueDetails();
    cy.wait(5000);
    cy.get(placeholder).first().should("have.value", "20");
    closeIssueDetails();

    openIssueDetails();
    cy.get(placeholder).first().should("have.value", "20").clear();
    cy.log("Cleared estimation");
    cy.get(placeholder).first().should("have.attr", "placeholder", "Number");
  });

  it("Should be able to log time and remove the logged time.", () => {
    cy.get(timeTracking).click();
    trackingTab().within(() => {
      cy.get(placeholder).first().clear().type("2");
      cy.get(placeholder)
        .eq(1)
        .should("have.attr", "placeholder", "Number")
        .type("5");
      cy.contains("button", "Done").click();
    });

    getIssueDetailsModal().within(() => {
      cy.get(timeTrackingPreview).should("exist");
      cy.wait(5000);
      cy.get(timeTrackingPreview).should("contain", "2h logged");
      cy.get(timeTrackingPreview).should("contain", "5h remaining");
      closeIssueDetails();
    });

    openIssueDetails();
    getIssueDetailsModal().within(() => {
      cy.get(timeTracking).should("exist").click();
    });

    trackingTab().within(() => {
      cy.get(placeholder).first().should("have.value", "2").clear();
      cy.log("Cleared estimation");
      cy.get(placeholder).eq(1).should("have.value", "5").clear();
      cy.log("Cleared estimation");
      cy.contains("button", "Done").click();
    });

    getIssueDetailsModal().within(() => {
      cy.get(timeTrackingPreview).should("exist");
      cy.wait(5000);
      cy.get(timeTrackingPreview).should("contain", "No time logged");
    });
  });
});
