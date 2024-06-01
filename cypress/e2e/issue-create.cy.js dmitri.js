import { faker } from "@faker-js/faker"

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {

        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  it('Should create an issue and validate it successfully', () => {
  
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION');
      cy.get('input[name="title"]').type('TEST_TITLE');
      cy.get('input[name="title"]').should('have.value', 'TEST_TITLE');
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').wait(1000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
           
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('TEST_TITLE')
      .within(() => {
        
        cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  it('Should validate title is required field if missing', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get('.ql-editor').type('TEST_DESCRIPTION');
    cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION');
   purpose
   implementation
    cy.get('input[name="title"]').type('TEST_TITLE');
    cy.get('input[name="title"]').should('have.value', 'TEST_TITLE');
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="selectoption:Story"]').wait(1000).trigger('mouseover').trigger('click');
    cy.get('[data-testid="icon:story"]').should('be.visible');
    cy.get('[data-testid="select:reporterId"]').click();
    cy.get('[data-testid="select-option:Pickle Rick"]').click();
    cy.get('[data-testid="form-field:userIds"]').click();
    cy.get('[data-testid="select-option:Lord Gaben"]').click();
    cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
    cy.get('[data-testid="board-list:backlog"]')
    .should('be.visible')
    .and('have.length', '1')
    .within(() => {
    cy.get('[data-testid="list-issue"]')
    .should('have.length', '5')
    .first()
    .find('p')
    .contains('TEST_TITLE')
    .siblings()
    .within(() => {
    cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
    cy.get('[data-testid="icon:story"]').should('be.visible');
    });
    });
    cy.get('[data-testid="board-list:backlog"]')
    .contains('TEST_TITLE')
    .within(() => {
    cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
    cy.get('[data-testid="icon:story"]').should('be.visible');
    });
    }); 

    it('Should create another task and validate it successfully', () => {
      let title = faker.lorem.word();
      let description = faker.lorem.sentence();
     
      cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type(description);
      cy.get('input[name="title"]').type(title);
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();
      cy.get('input[name="title"]').should('have.value', title);
      cy.get('.ql-editor').should('have.text', description);
      cy.get('[data-testid="select:type"]').should('have.text', 'Task');
      cy.get('[data-testid="select:reporterId"]').should('have.text', 'Baby Yoda');
      cy.get('[data-testid="select:priority"]').should('have.text', 'Low');
      cy.get('button[type="submit"]').click();
      });
      cy.get('[data-testid="modal:issue-create"]').should('not.exist');
      cy.contains('Issue has been successfully created.').should('be.visible');
      cy.reload();
      cy.contains('Issue has been successfully created.').should('not.exist');
      cy.get('[data-testid="boardlist:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
      .should('have.length', '5').first()
      .find('p').contains(title);
      cy.get('[data-testid="icon:task"]').should('be.visible');
      });
      });
});