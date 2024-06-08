import { faker } from "@faker-js/faker";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const textField = 'textarea[placeholder="Add a comment..."]';
  const commentSection = '[data-testid="issue-comment"]';
  const getConfirmationDelete = () => cy.get('[data-testid="modal:confirm"]');
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it.only("Should create, edit and delete a NEW comment successfully", () => {
    let comment = faker.lorem.words(4);

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();
      cy.get(textField).type(comment);
      cy.contains("button", "Save").click();
      cy.contains("Add a comment...").should("exist");
      cy.get(commentSection).should("contain", comment);
    });

    getIssueDetailsModal().within(() => {
      cy.get(commentSection)
        .first()
        .within(() => {
          cy.contains("Edit").click();
        });
      cy.get(textField).clear().type(comment);
      cy.contains("button", "Save").click();
      cy.get(commentSection).should("contain", comment);
    });

    getIssueDetailsModal().within(() => {
      cy.get(commentSection)
        .first()
        .within(() => {
          cy.contains("Delete").click();
        });
    });

    getConfirmationDelete().within(() => {
      cy.contains("button", "Delete comment").click();
    });

    getIssueDetailsModal().find(commentSection).should("exist");
  });
});
