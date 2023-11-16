import {Body, Button, Container, Head, Html, Link, Preview, Section, Text,} from "@react-email/components";
import {Font} from "@react-email/font";
import {Tailwind} from "@react-email/tailwind";

export const PasswordResetEmail = ({}) => {
	return (
		<Tailwind
			config={{
				theme: {
					extend: {
						colors: {
							"light-orange": "#EADBC8",
							primary: "#F1EFEF",
							'dark-gray': "#4D5157",
						},
					},
				},
			}}
		>
			<Html>
				<Head>
					<Font
						fontFamily="Karla"
						fallbackFontFamily="sans-serif"
						webFont={{
							url: "https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&display=swap",
							format: "embedded-opentype",
						}}
						fontWeight={400}
						fontStyle="normal"
					/>
				</Head>
				<Preview>OneStopMALL reset your password</Preview>
				<Body>
					<Container>
						<Section className="bg-light-orange p-6">
							<Text
								style={{letterSpacing: "0.15rem"}}
								className="text-2xl font-medium text-center"
							>
								OneStopMALL
							</Text>
							<Text className="text-2xl font-bold text-center">
								Reset your password
							</Text>
						</Section>
						<Section className="p-6 bg-primary">
							<Text>Dear {"{{Firstname}}"}</Text>
							<Text>
								We received a request to reset the password associated with yourOneStopMALL account. To proceed with the
								password reset, follow the instructions below.
							</Text>
							<Text>
								Please click on the following link to reset your password:
							</Text>
							<Button href="{{ResetLink}}" className="px-6 py-4 bg-dark-gray text-primary font-bold">
								Reset link
							</Button>
							<Text>
								If the above link does not work, you can copy and paste the
								following URL into your browser:
							</Text>
							<Link href="{{ResetLink}}" className="break-all">{"{{ResetLink}}"}</Link>
							<Text>
								Please note that this link is valid for the next 10 minutes. If
								you do not verify your email within this time frame, you may
								need to request a new verification email.
							</Text>
							<Text>
								If you did not sign up for OneStopMALL, or if you believe you
								received this email in error, please ignore it. Your information
								will not be used or stored.
							</Text>
							<Text>
								Best regards, <br/>
								OneStopMALL team
							</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};

export default PasswordResetEmail;
