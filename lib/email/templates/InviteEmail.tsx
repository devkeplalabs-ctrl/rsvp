import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Event } from "@/db/schema";

interface Props {
  guestName: string;
  event: Event;
  inviteUrl: string;
}

export function InviteEmail({ guestName, event, inviteUrl }: Props) {
  const formattedDate = new Date(event.startsAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(event.startsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Html>
      <Head />
      <Preview>You're invited to {event.title}</Preview>
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
          {/* Header */}
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

          {/* Cover image */}
          {event.coverImageUrl && (
            <Img
              src={event.coverImageUrl}
              alt={event.title}
              width="600"
              style={{ display: "block", width: "100%" }}
            />
          )}

          {/* Body */}
          <Section style={{ padding: "32px" }}>
            <Heading
              style={{ fontSize: "24px", color: "#18181b", marginBottom: "16px" }}
            >
              {event.title}
            </Heading>
            <Text style={{ color: "#52525b", fontSize: "16px", lineHeight: "1.6" }}>
              Hi {guestName}, you've been invited to join us for {event.title}.
              {event.description ? ` ${event.description}` : ""}
            </Text>

            {/* Details */}
            <Section
              style={{
                backgroundColor: "#fafaf9",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "24px",
              }}
            >
              <Text style={{ margin: "4px 0", color: "#3f3f46", fontSize: "14px" }}>
                📅 <strong>Date</strong> — {formattedDate}
              </Text>
              <Text style={{ margin: "4px 0", color: "#3f3f46", fontSize: "14px" }}>
                🕐 <strong>Time</strong> — {formattedTime}
              </Text>
              {event.location && (
                <Text style={{ margin: "4px 0", color: "#3f3f46", fontSize: "14px" }}>
                  📍 <strong>Location</strong> — {event.location}
                </Text>
              )}
            </Section>

            <Button
              href={inviteUrl}
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
              RSVP Now
            </Button>

            {event.rsvpDeadline && (
              <Text
                style={{ color: "#a1a1aa", fontSize: "13px", textAlign: "center", marginTop: "12px" }}
              >
                Please respond by{" "}
                {new Date(event.rsvpDeadline).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            )}
          </Section>

          <Hr style={{ borderColor: "#e4e4e7" }} />

          {/* Footer */}
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

export default InviteEmail;
