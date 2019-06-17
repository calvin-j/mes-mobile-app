export const template: string = `
  <body>
    <!-- Use this to style the document, can contain all CSS requried in a single DIV -->
    <div style="background-color: white; border: 1px solid #aaa; padding: 4px;">
      <!-- The placeHolderExample will be replaced by the one applied in the TS file -->
      <h1> Test Results for <%- candidateName %></h1>
      <hr/>
      <div>Driver Number: <%- driverNumber %></div>
      <div>Test Result: <span style="background-color: #4b9e65;"><%- testResult %></span></div>
    </div>
  </body>
`;
