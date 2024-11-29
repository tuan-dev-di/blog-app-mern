import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

const FooterComponent = () => {
  return (
    // <Footer container>
    //   <Footer.Copyright
    //     href="https://github.com/tuan-dev-di"
    //     by="Arys Domi"
    //     year={2024}
    //   />
    //   <div className="grid gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">
    //     <Footer.Title title="Privacy Policy" />
    //     <Footer.Title title="Outstanding" />
    //     <Footer.Title title="Contact" />

    //   </div>
    // </Footer>
    <Footer container className="border-t-2">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 ">
          <div className="mt-5">
            <Footer.Brand
              href="https://github.com/tuan-dev-di"
              src="https://eastus1-mediap.svc.ms/transform/thumbnail?provider=spo&farmid=193768&inputFormat=jpg&cs=MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!T_R4d1A2kEKTS2xCnPnm8t-xJXb02LBJmdEbimiI5vtUNKg--GyrRarHA72gRyC3%2Fitems%2F01AXMQAMHL35YNUC7LD5CYADYGTURMF2CF%3Ftempauth%3Dv1e.eyJzaXRlaWQiOiI3Nzc4ZjQ0Zi0zNjUwLTQyOTAtOTM0Yi02YzQyOWNmOWU2ZjIiLCJhcHBpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDA0ODE3MTBhNCIsImF1ZCI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMC9teS5taWNyb3NvZnRwZXJzb25hbGNvbnRlbnQuY29tQDkxODgwNDBkLTZjNjctNGM1Yi1iMTEyLTM2YTMwNGI2NmRhZCIsImV4cCI6IjE3MzI4Mjc2MDAifQ.a8qNEXkZYJhU3AYAKziVFHNtdsex85zy4FSKjtKxvAklPV3_6aF2Ip4sBvf0kLFOyVKP5l195Z6Gjpnt0GMpaKX0hwtHEXAzqN9xPaLDRmhw-0NwLQm_WiSOIcNARAUQEYi0Y1bNHLzFWHV5kE1mc34oPS5DU5WcETB34PMUXa3ylOI5Yvvn9uQrjw8JqBBzSMBztRUxiDHk_MqGt520uHu1xFBMPPnCf9WPxcwXFS8i05njN63YnMnZhpbAxn_WaeIeg07WwlQu5S5uJUT1FONeQFAXUvw4DjN6NH7bVNwGMFalshG84zdZI2gcWy6qalZmVEZVG5UD-b1krAneTPR29EcPNzySteXfNOplBcziD2Atf4qbFi8MO2r1eE5u.E6aeYYY741y7IwquZxalZMHF-oqN8kZYQGm6ta5PjD4%26version%3DPublished&cb=63858873257&encodeFailures=1&width=873&height=571"
              alt="Arys Domi"
              name="Arys Domi"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 mt-5">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Flowbite</Footer.Link>
                <Footer.Link href="#">Tailwind CSS</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="https://github.com/tuan-dev-di"
            by="Arys Domi"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsGithub} />
            {/* <Footer.Icon href="#" icon={BsDribbble} /> */}
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
