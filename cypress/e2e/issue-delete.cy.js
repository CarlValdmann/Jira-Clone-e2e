import { faker } from "@faker-js/faker";

const deleteButton = '[data-testid="icon:trash"]';
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]', { timeout: 60000 });
const getConfirmationDelete = () =>
  cy.get('[data-testid="modal:confirm"]', { timeout: 60000 });
const listBackLog = '[data-testid="board-list:backlog"]';

describe("Deleting issues", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("should delete the selected issue and verify the deletion confirmation dialog is not visible", () => {
    getIssueDetailsModal().within(() => {
      cy.get(deleteButton).should("be.visible").click();
    });

    getConfirmationDelete()
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Delete issue").click();
      });

    getConfirmationDelete().should("not.exist");
    getIssueDetailsModal().should("not.exist");

    cy.get(listBackLog)
      .contains("This is an issue of type: Task.")
      .should("not.exist");
  });

  it("Cancel the deletion in the confirmation pop-up", () => {
    getIssueDetailsModal().within(() => {
      cy.get(deleteButton).should("be.visible").click();
    });

    getConfirmationDelete()
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Cancel").click();
      });

    getConfirmationDelete().should("not.exist");
    getIssueDetailsModal().should("exist");

    cy.get(listBackLog)
      .contains("This is an issue of type: Task.")
      .should("exist");
  });
});
