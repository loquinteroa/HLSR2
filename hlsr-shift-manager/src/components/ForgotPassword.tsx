import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current!.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <>
      <Card
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Card.Header
          className="text-center py-4"
          style={{
            background: "linear-gradient(135deg, #1F3A5F 0%, #162d4a 100%)",
            border: "none",
          }}
        >
          <h2 className="mb-0" style={{ letterSpacing: "0.05em" }}>
            <span style={{ color: "#E07A2F", fontWeight: 700 }}>
              ITC Shift Manager
            </span>
          </h2>
        </Card.Header>
        <Card.Body className="px-4 pt-4">
          <h2 className="text-center mb-4" style={{ color: "#1F3A5F" }}>
            Password Reset
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="mb-3">
              <Form.Label style={{ color: "#1F3A5F", fontWeight: 600 }}>
                Email
              </Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                style={{ borderRadius: "6px" }}
              />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100"
              type="submit"
              style={{
                backgroundColor: "#E07A2F",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                padding: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#c96a22")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#E07A2F")
              }
            >
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/login" style={{ color: "#E07A2F" }}>
              Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
