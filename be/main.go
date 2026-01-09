package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	_ "github.com/lib/pq"
	"github.com/golang-jwt/jwt/v5"
)

var db *sql.DB

type UserClaims struct {
	Sub   string `json:"sub"`
	Email string `json:"email"`
	Name  string `json:"name"`
	jwt.RegisteredClaims
}

type SignupEvent struct {
	IDToken string `json:"id_token"`
}

func init() {
	connStr := os.Getenv("DB_DSN") // e.g. postgres://user:pass@host/db
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var event SignupEvent
	if err := json.Unmarshal([]byte(req.Body), &event); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 400}, err
	}

	claims := &UserClaims{}
	_, _, err := jwt.NewParser().ParseUnverified(event.IDToken, claims)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 400}, err
	}

	// Optional: check if user exists
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE cognito_sub = $1)", claims.Sub).Scan(&exists)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, err
	}
	if exists {
		return events.APIGatewayProxyResponse{StatusCode: 200, Body: `{"message":"User already exists"}`}, nil
	}

	// Insert new user
	_, err = db.Exec(`INSERT INTO users (id, cognito_sub, email, full_name, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
		claims.Sub, claims.Email, claims.Name, time.Now())
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 201,
		Body:       `{"message":"User created successfully"}`,
	}, nil
}

func main() {
	lambda.Start(handler)
}
