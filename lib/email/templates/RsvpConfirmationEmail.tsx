import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Event } from "@/db/schema";

interface Props {
  guestName: string;
  event: Event;
  status: "yes" | "no" | "maybe";
  changeUrl: string;
}

const statusLabels = {
  yes: "Going ✅",
  no: "Can't make it ❌",
  maybe: "Maybe 🤔",
};

export function RsvpConfirmationEmail({
  guestName,
  event,
  status,
  changeUrl,
}: Props) {
  const formattedDate = new Date(event.startsAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(event.startsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Html>
      <Head />
      <Preview>Your RSVP for {event.title} is confirmed</Preview>
      <Body style={{ backgroundColor: "#fafaf9", fontFamily: "sans-serif" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Section style={{ padding: "24px", textAlign: "center" }}>
            <Text
              style={{
                color: "#be123c",
                fontWeight: "700",
                fontSize: "20px",
                letterSpacing: "0.05em",
              }}
            >
              RSVP
            </Text>
          </Section>

          <Section style={{ padding: "32px" }}>
            <Heading style={{ fontSize: "24px", color: "#18181b" }}>
              You're confirmed! 🎉
            </Heading>
            <Text style={{ color: "#52525b", fontSize: "16px", lineHeight: "1.6" }}>
              Hi {guestName}, your response for <strong>{event.title}</strong> has
              been recorded.
            </Text>

            <Section
              style={{
                backgroundColor: "#fafaf9",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "16px",
              }}
            >
              <Text style={{ margin: "4px 0", color: "#3f3f46", fontSize: "14px" }}>
                <strong>Status:</strong> {statusLabels[status]}
              </Text>
              <Text style={{ margin: "4px 0", color: "#3f3f46", fontSize: "14px" }}>
                📅 {formattedDate} at {formattedTime}
              </Text>
              {event.location && (
                <Text style={{ margin: "4px 0", color: "#3f3f46", fontSize: "14px" }}>
                  📍 {event.location}
                </Text>
              )}
            </Section>

            <Button
              href={changeUrl}
              style={{
                display: "block",
                width: "100%",
                backgroundColor: "#be123c",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "14px 24px",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "center",
                marginTop: "24px",
                textDecoration: "none",
              }}
            >
              Change Response
            </Button>
          </Section>

          <Hr style={{ borderColor: "#e4e4e7" }} />
          <Section style={{ padding: "16px 32px", textAlign: "center" }}>
            <Text style={{ color: "#a1a1aa", fontSize: "12px" }}>
              Privacy · Terms · Support
            </Text>
            <Text style={{ color: "#d4d4d8", fontSize: "11px" }}>
              SENT VIA RSVP EDITORIAL · © 2024 RSVP Editorial. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default RsvpConfirmationEmail;
