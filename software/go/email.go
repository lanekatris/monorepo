package shared

import (
	"github.com/charmbracelet/log"
	"github.com/resend/resend-go/v2"
)

type EmailClient interface {
	SendEmail(to string, subject string, body string) error
}

type MockEmailClient struct {
	SentEmails []string
	Err        error
}

func (m *MockEmailClient) SendEmail(to string, subject string, body string) error {
	m.SentEmails = append(m.SentEmails, to)
	return m.Err
}

type ResendClient struct {
	client *resend.Client
}

func NewResendClient(apiKey string) *ResendClient {
	return &ResendClient{
		client: resend.NewClient(apiKey),
	}
}
func (c *ResendClient) SendEmail(to string, subject string, body string) error {
	params := &resend.SendEmailRequest{
		From:    "onboarding@resend.dev",
		To:      []string{to},
		Subject: subject,
		Html:    body,
	}

	send, err := c.client.Emails.Send(params)
	if err != nil {
		return err
	}
	log.Info(send)
	return nil
}
