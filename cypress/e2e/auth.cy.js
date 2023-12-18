const credentials={
  Admin: {
      login:"m.saghfary@aui.ma",
      password:"Mounir123",
  },
  nonExistant:{
      login:"imposter@aui.ma",
      password:"imposter",
  },
};

const LogInUser = (credentials) => {
  cy.get('[name="email"]').type(credentials.login).should("have.value",credentials.login);
  cy.get('[name="password"]').type(credentials.password).should("have.value",credentials.password);
};

describe("Login Test", ()=> {
  beforeEach("Visit login page", () =>{
      cy.visit("http://localhost:5173/SignIn");
  });

  it("No login, empty form", ()=>{
      cy.contains("Sign In").click();
      cy.intercept("/api/user",{
          statusCode: 400,
      });
      cy.url().should("include", "/SignIn");
  });

  it("No login, email only",()=>{
      cy.get('[name="email"]').type(credentials.Admin.login).should("have.value",credentials.Admin.login);
      cy.contains("Sign In").click();
      cy.intercept("/api/user",{
          statusCode: 400,
      });
      cy.url().should("include", "/SignIn");
  });

  it("No login, password only",()=>{
      cy.get('[name="password"]').type(credentials.Admin.password).should("have.value",credentials.Admin.password);
      cy.contains("Sign In").click();
      cy.intercept("/api/user",{
          statusCode: 400,
      });
      cy.url().should("include", "/SignIn");
  });

  it("No Login, invalid email or password", ()=>{
      LogInUser(credentials.nonExistant);
      cy.contains("Sign In").click();
      cy.url().should("include","/SignIn");
  });

  it("Should log the user in", ()=>{
      LogInUser(credentials.Admin);
      cy.contains("Sign In").click();
      cy.location("pathname").should("include","/Welcome");
  });

});