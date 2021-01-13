/*
 * ALICE Bookkeeping
 *
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * API version: 0.0.0
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */
package swagger

// Describes an intervention or an event that happened.
type User struct {
	// The unique CERN identifier of this user.
	ExternalId int64 `json:"externalId"`
	// The unique identifier of this entity.
	Id int64 `json:"id"`
	// Name of the user.
	Name string `json:"name"`
}
