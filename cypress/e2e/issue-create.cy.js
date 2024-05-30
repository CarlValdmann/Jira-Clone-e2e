import { faker } from "@faker-js/faker";

const createIssueModal = '[data-testid="modal:issue-create"]';
const descriptionInput = ".ql-editor";
const titleInput = 'input[name="title"]';
const issueType = '[data-testid="select:type"]';
const issueTypeStory = '[data-testid="select-option:Story"]';
const iconStory = '[data-testid="icon:story"]';
const issueTypeBug = '[data-testid="select-option:Bug"]';
const iconBug = '[data-testid="icon:bug"]';
const issueTypeTask = '[data-testid="select-option:Task"]';
const iconTask = '[data-testid="icon:task"]';
const reporterDropdown = '[data-testid="select:reporterId"]';
const assigneeDropdown = '[data-testid="form-field:userIds"]';
const selectAssignee = '[data-testid="select:userIds]';
const optionBabyYoda = '[data-testid="select-option:Baby Yoda"]';
const optionPickleRick = '[data-testid="select-option:Pickle Rick"]';
const optionLordGaben = '[data-testid="select-option:Lord Gaben"]';
const buttonCreateIssue = 'button[type="submit"]';
const creatingIssueSuccess = "Issue has been successfully created.";
const listBackLog = '[data-testid="board-list:backlog"]';
const listIssues = '[data-testid="list-issue"]';
const avatarPickleRick = '[data-testid="avatar:Pickle Rick"]';
const avatarLordGaben = '[data-testid="avatar:Lord Gaben"]';
const avatarBabyYoda = '[data-testid="avatar:Baby Yoda"]';
const errorMessage = '[data-testid="form-field:title"]';
const priorityDropdown = '[data-testid="select:priority"]';
const priorityHighest = '[data-testid="select-option:Highest"]';
const priorityLow = '[data-testid="select-option:Low"]';
const priorityColorLow = "rgb(45, 135, 56)";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get(createIssueModal).within(() => {
      // Type value to description input field
      cy.get(descriptionInput).type("TEST_DESCRIPTION");
      cy.get(descriptionInput).should("have.text", "TEST_DESCRIPTION");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get(titleInput).type("TEST_TITLE");
      cy.get(titleInput).should("have.value", "TEST_TITLE");

      // Open issue type dropdown and choose Story
      cy.get(issueType).click();
      cy.get(issueTypeStory).wait(1000).trigger("mouseover").trigger("click");
      cy.get(iconStory).should("be.visible");

      // Select Baby Yoda from reporter dropdown
      cy.get(reporterDropdown).click();
      cy.get(optionBabyYoda).click();

      // Select Pickle Rick from assignee dropdown
      cy.get(assigneeDropdown).click();
      cy.get(optionPickleRick).click();

      // Click on button "Create issue"
      cy.get(buttonCreateIssue).click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get(createIssueModal).should("not.exist");
    cy.contains(creatingIssueSuccess).should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains(creatingIssueSuccess).should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get(listBackLog)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get(listIssues)
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get(avatarPickleRick).should("be.visible");
            cy.get(iconStory).should("be.visible");
          });
      });

    cy.get(listBackLog)
      .contains("TEST_TITLE")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get(avatarPickleRick).should("be.visible");
        cy.get(iconStory).should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get(createIssueModal).within(() => {
      // Try to click create issue button without filling any data
      cy.get(buttonCreateIssue).click();

      // Assert that correct error message is visible
      cy.get(errorMessage).should("contain", "This field is required");
    });
  });

  it("Should create a new issue with given information ", () => {
    cy.get(createIssueModal).within(() => {
      cy.get(descriptionInput).type("My bug description");
      cy.get(descriptionInput).should("have.text", "My bug description");

      cy.get(titleInput).type("Bug");
      cy.get(titleInput).should("have.value", "Bug");

      cy.get(issueType).click();
      cy.get(issueTypeBug).wait(1000).trigger("mouseover").trigger("click");
      cy.get(iconBug).should("be.visible");

      cy.get(reporterDropdown).click();
      cy.get(optionPickleRick).click();

      cy.get(assigneeDropdown).click();
      cy.get(optionLordGaben).click();

      cy.get(priorityDropdown).click();
      cy.get(priorityHighest).click();

      cy.get(buttonCreateIssue).click();
    });

    cy.get(createIssueModal).should("not.exist");
    cy.contains(creatingIssueSuccess).should("be.visible");

    cy.reload();
    cy.contains(creatingIssueSuccess).should("not.exist");

    cy.get(listBackLog)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(listIssues)
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("Bug")
          .siblings()
          .within(() => {
            cy.get(avatarLordGaben).should("be.visible");
            cy.get(iconBug).should("be.visible");
          });
      });

    cy.get(listBackLog)
      .contains("Bug")
      .within(() => {
        cy.get(avatarLordGaben).should("be.visible");
        cy.get(iconBug).should("be.visible");
      });
  });
});

it.only("Should create a new issue with random data and assert it's visible on the board ", () => {
  let description = faker.lorem.words(5);
  let title = faker.lorem.words(1);
  let issueTypeNotTask = false;
  let assigneeDropdown = false;

  createNewIssue(
    description,
    title,
    priorityLow,
    optionBabyYoda,
    assigneeDropdown,
    issueTypeNotTask
  );

  verifyNewIssueOnBacklog(
    title,
    iconBug,
    priorityLow,
    priorityColorLow,
    assigneeDropdown
  );
});

function createNewIssue(
  myDescription,
  myTitle,
  myPriority,
  myReporter,
  assigneePresent,
  myAssignee,
  issueTypeNotTask,
  myIssueType,
  myIssueIcon
) {
  cy.get(createIssueModal).within(() => {
    cy.get(descriptionInput)
      .type(myDescription)
      .should("have.text", myDescription);
    cy.get(titleInput).type(myTitle).should("have.value", myTitle);
    cy.get(priorityDropdown).click();
    cy.get(myPriority).wait(1000).trigger("mouseover").trigger("click");
    cy.get(reporter).click();
    cy.get(myReporter).click();
    if (assigneePresent) {
      cy.get(assigneeDropdown).click();
      cy.get(myAssignee).click();
    } else {
      cy.get(selectAssignee).should("have.text", "Select");
    }
    if (issueTypeNotTask) {
      cy.get(issueType).click();
      cy.get(myIssueType).wait(1000).trigger("mouseover").trigger("click");
      cy.get(myIssueIcon).should("be.visible");
    } else {
      cy.get(issueType).first().find("i").siblings().contains("Task");
      cy.get(iconTask).scrollIntoView().should("be.visible");
    }
    cy.get(buttonCreateIssue).click();
  });
}

function verifyNewIssueOnBacklog(
  prevIssueTitle,
  prevIssueTypeIcon,
  prevPriorityIcon,
  priorityLevelColor,
  assigneePresent,
  prevAssigneeAvatar
) {
  cy.get(createIssueModal).should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
  cy.get(listBackLog)
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get(listIssue)
        .should("have.length", "5")
        .first()
        .find("p")
        .contains(prevIssueTitle)
        .siblings()
        .within(() => {
          cy.get(prevIssueTypeIcon).should("be.visible");
          cy.get(prevPriorityIcon)
            .should("be.visible")
            .and("have.css", "color", priorityLevelColor);
          if (assigneePresent) {
            cy.get(prevAssigneeAvatar).should("be.visible");
          } else {
            cy.get(divBacklogAssigneeAvatar).should("not.be.visible");
          }
        });
    });
}
