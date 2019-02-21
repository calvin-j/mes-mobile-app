package scenarios

import java.util.concurrent.TimeUnit

import io.gatling.core.scenario.Simulation
import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder

import scala.concurrent.duration.{Duration, FiniteDuration}


class LambdaPerformanceSingleEndpoint extends Simulation {


  val csvUser = csv("users.csv")                         // csv feeder currently not working csv file stored in test/resources

                                                         //setting authorisation token --Temporary Solution--
  private val token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCIsImtpZCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCJ9.eyJhdWQiOiIwOWZkZDY4Yy00ZjJmLTQ1YzItYmU1NS1kZDk4MTA0ZDRmNzQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YzQ0OGQ5MC00Y2ExLTRjYWYtYWI1OS0wYTJhYTY3ZDc4MDEvIiwiaWF0IjoxNTUwNjc3MzUzLCJuYmYiOjE1NTA2NzczNTMsImV4cCI6MTU1MDY3ODg1MywiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhLQUFBQXpoYTlhN0o4NTViMzNuOEw0NjZyM0N6T05vTjk0RHZITnM1TDdubGRtYlE9IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjA5ZmRkNjhjLTRmMmYtNDVjMi1iZTU1LWRkOTgxMDRkNGY3NCIsImFwcGlkYWNyIjoiMCIsImV4dG4uZW1wbG95ZWVJZCI6WyIwMTIzNDU2NyJdLCJpcGFkZHIiOiIxNDguMjUzLjEzNC4yMTIiLCJuYW1lIjoiTUVTQmV0YSBVc2VyIDEiLCJvaWQiOiI4ZTA2NDY4MC04YWJlLTRlZjktYWNiYi0yOWQ1YTMwYWE2ZWMiLCJzY3AiOiJEaXJlY3RvcnkuUmVhZC5BbGwgVXNlci5SZWFkIiwic3ViIjoidnBKd0RVb0xtaXBLRE0weEw1NzgwYWs1eDNrWlktQzlpZE90WG1jTVFVSSIsInRpZCI6IjZjNDQ4ZDkwLTRjYTEtNGNhZi1hYjU5LTBhMmFhNjdkNzgwMSIsInVuaXF1ZV9uYW1lIjoibW9iZXhhbWluZXIxQGR2c2Fnb3Yub25taWNyb3NvZnQuY29tIiwidXBuIjoibW9iZXhhbWluZXIxQGR2c2Fnb3Yub25taWNyb3NvZnQuY29tIiwidXRpIjoiVldYSmN1Smg3a0tDRzN6NHF2dkpBQSIsInZlciI6IjEuMCJ9.SWJsRv7-GwFv3Cc2Qo6Zq6ePnvwimeBsUl0SxpYhAVRHqQia9SFcYEM0wdAdm0zR1Tt7-RfR_Kw0ucMR6vlLf0IH8_jZPEf1Q4bo6j0DF5-6lmG6XHExaeQLEaCi_Fwraq01l9sajbCWe7X-tLaCYOpljtB_4P5Ka9F5g1vzKjaVeEV8gYE_YXThF2vMTr2VRXwMlnjwqktXadOnsnEQ40vZxF6sZDSgZ9qnA7gSpU8DjsuUZsZOImxNRnGY2PUTAMQpedcxft8qyynk1va05E7ihQC2ljOACALK6i6X4LeNAP3OGk0PqZbwTEG1oyC_Ca2LPetfhYhhqrGgmAWPUQ"
  val headers = Map("Content-Type" -> """application/json""", "Authorization" -> token)

                                                         //values for scenario
  private val baseUrl = "https://dev.mes.dev-dvsacloud.uk/v1/"
  private val user1 = "journals/67128492/personal"       // endpoint
  private val contentType = "application/json"           // content type for httpProtocol

                                                         // values for setUp phase
  private val waitTime = 1                               // wait before scenario ends (seconds)
  private val maxUsers = 15                              // max users used at once in scenario
  private val rampUpDuration = 15                        // time to ramp up users to full capacity (seconds)
  private val maxDuration = 300                          // duration of test run (seconds)

  val httpProtocol: HttpProtocolBuilder = http
    .baseUrl(baseUrl)
    .inferHtmlResources()
    .acceptHeader("*/*")
    .contentTypeHeader(contentType)

  val scn: ScenarioBuilder = scenario("Get_Journal")
    .forever("Get Journal", exitASAP = true) {            // forever loop max duration can be found in setUp section
    exec(http("Get_Journal_67128492")
      .get(baseUrl + user1)                               // get on url with endpoint
      .headers(headers)                                   // sets headers
      .check(status.is(200),                              // checks status
        substring("testSlot")))                           // checks if response body contains "testSlot"
      .pause(Duration.apply(waitTime, TimeUnit.SECONDS))  // wait before loop ends
  }

  //setUp section allows to change ramp up and sets maximum duration of the test
  setUp(
    scn.
      inject(
        heavisideUsers(maxUsers) during rampUpDuration))  // max number of users achieved in set amount of time then simulation runs on loo until maxDuration expires
    .maxDuration(FiniteDuration.apply(maxDuration, TimeUnit.SECONDS))
}