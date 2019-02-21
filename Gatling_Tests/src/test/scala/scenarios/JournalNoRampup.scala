package scenarios

import java.util.concurrent.TimeUnit

import io.gatling.core.scenario.Simulation
import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder

import scala.concurrent.duration.{Duration, FiniteDuration}


class JournalNoRampup extends Simulation {
  // csv feeder currently not working csv file stored in test/resources
  val csvFeeder = csv("users.csv").random

  //setting authorisation token --Temporary Solution--
  private val token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCIsImtpZCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCJ9.eyJhdWQiOiIwOWZkZDY4Yy00ZjJmLTQ1YzItYmU1NS1kZDk4MTA0ZDRmNzQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YzQ0OGQ5MC00Y2ExLTRjYWYtYWI1OS0wYTJhYTY3ZDc4MDEvIiwiaWF0IjoxNTUwNjY4NDA2LCJuYmYiOjE1NTA2Njg0MDYsImV4cCI6MTU1MDY2OTkwNiwiYWNyIjoiMSIsImFpbyI6IjQySmdZRkFKcjVyTm1KTmZJdGNReEI3eWNuYXo5TW1KcjNyL0JreThPTHZ0bWF0YXkzTUEiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiMDlmZGQ2OGMtNGYyZi00NWMyLWJlNTUtZGQ5ODEwNGQ0Zjc0IiwiYXBwaWRhY3IiOiIwIiwiZXh0bi5lbXBsb3llZUlkIjpbIjAxMjM0NTY3Il0sImlwYWRkciI6IjE0OC4yNTMuMTM0LjIxMiIsIm5hbWUiOiJNRVNCZXRhIFVzZXIgMSIsIm9pZCI6IjhlMDY0NjgwLThhYmUtNGVmOS1hY2JiLTI5ZDVhMzBhYTZlYyIsInNjcCI6IkRpcmVjdG9yeS5SZWFkLkFsbCBVc2VyLlJlYWQiLCJzdWIiOiJ2cEp3RFVvTG1pcEtETTB4TDU3ODBhazV4M2taWS1DOWlkT3RYbWNNUVVJIiwidGlkIjoiNmM0NDhkOTAtNGNhMS00Y2FmLWFiNTktMGEyYWE2N2Q3ODAxIiwidW5pcXVlX25hbWUiOiJtb2JleGFtaW5lcjFAZHZzYWdvdi5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJtb2JleGFtaW5lcjFAZHZzYWdvdi5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiI0a29kbXBDa1dFLXRrblNCZG9DdEFBIiwidmVyIjoiMS4wIn0.MFshCPx1HLjIcVQEPiLQ0NZUMHsk5CSgC2Ttg8sMwwIpooKc4PsMNjg_JsdJRdEyISZXpbghUsJwIUBJbXrcF-3Fiy48GKLzIFx-AxZYJG19VafvEysZNGdadfrtNqmLUmYUtNPZDxs5UagcnnklowXqCinPBDzShYpLY8BGuLdMNCMb4eu9r5yFWFiSSoMS8ZPc76NOng8BOGapxdpse07q9I85056wPb4BQ2NYwsbePoA8rDsL9t0CHth45IN4GipGICxwRKlM-pFwApbwNe4ES1sO9z49JIgkmbD0jvaf8LNXs4Hh-d772eBwwI38jGAwCbJnOytY8bg5GoF-JA"
  val headers_10 = Map("Content-Type" -> """application/json""", "Authorization" -> token)

  //values for scenario
  private val baseUrl = "https://dev.mes.dev-dvsacloud.uk/v1/journals/"
  private val uri = baseUrl + "01234567/personal"
  private val uri2 = baseUrl + "67128492/personal"
  private val contentType = "application/json"

  //values for setUp phase
  private val staticRequestCount = 2
  private val waitTime = 5
  private val maxDuration = 30

  val httpProtocol: HttpProtocolBuilder = http
    .baseUrl(baseUrl)
    .inferHtmlResources()
    .acceptHeader("*/*")
    .contentTypeHeader(contentType)

  val scn: ScenarioBuilder = scenario("Get_Journal")
    .exec(http("Get_Journal_01234567")
      .get(uri)
      .headers(headers_10)
      .check(status.is(200)))
    .pause(Duration.apply(waitTime, TimeUnit.SECONDS))

  val scn2: ScenarioBuilder = scenario("Get_Journal2")
    .exec(http("Get_Journal_67128492")
      .get(uri2)
      .header("Content-Type", contentType)
      .check(status.is(401)))
    .pause(Duration.apply(waitTime, TimeUnit.SECONDS))

  //Setup for users and maximum run time values
  setUp(scn.
    inject(nothingFor(waitTime),
      atOnceUsers(staticRequestCount)),
    scn2.
      inject(nothingFor(waitTime),
        atOnceUsers(staticRequestCount)))
    .maxDuration(FiniteDuration.apply(maxDuration, TimeUnit.SECONDS))
}