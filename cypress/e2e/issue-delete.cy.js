describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });

    it("Should select and delete an issue successfully", () => {
      cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      cy.get('data-testid="icon:trash"').should("be_visible").click();
      cy.get('data-testid="modal:confirm"').should("be_visible");
      cy.get("sc-bwzfXH dIxFno sc-kGXeez bLOzZQ").should("be_visible").click();
    });
  });
});
