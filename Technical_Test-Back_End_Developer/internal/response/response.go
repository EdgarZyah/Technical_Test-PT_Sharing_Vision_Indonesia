// Package response menyediakan helper untuk response JSON standar.
package response

import (
	"encoding/json"
	"net/http"
)

// ErrorResponse adalah format error response standar API.
type ErrorResponse struct {
	Error string `json:"error"`
}

// JSON mengirim response dengan Content-Type application/json dan status code yang diberikan.
func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// Error mengirim error response dengan pesan error.
func Error(w http.ResponseWriter, status int, message string) {
	JSON(w, status, ErrorResponse{Error: message})
}
