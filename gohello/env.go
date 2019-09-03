package main

import (
	"os"
)

// envVar holds details for an environment variable
type envVar struct {
	Key   string
	Value string
	Set   bool
}

// env reads an environment variable from the OS
func env(key string) envVar {
	value, set := os.LookupEnv(key)
	return envVar{Key: key, Value: value, Set: set}
}

// WithDefault returns the value of the environment variable if it is set.
// Otherwise it returns the provided default value.
func (e envVar) WithDefault(value string) string {
	if e.Set {
		return e.Value
	}
	return value
}
