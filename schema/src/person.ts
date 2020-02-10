import { JSONSchema6 } from 'json-schema'


export const schema : JSONSchema6 = {
  "definitions":{
  },
  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Person",
  "type": "object",
  "required": [ ],
  "additionalProperties": false,
  "properties" : {
    "Name" : {
        "type": "string",
        "description": ""
    },
    "Bio" : {
        "type": "string",
        "description": ""
    },
    "Website" : {
        "type": "string",
        "format":"url",
        "description": ""
    },
    "Organization" : {
        "type": "string",
        "description": ""
    },
    "Working Group" : {
        "type": "string",
        "description": ""
    },
    "Tags": {
		"type": "array",
		"items": {
			"type": "string"
			}
    },
    "Location" : {
        "type": "string",
        "description": "",
    },
    "Twitter Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    },
    "LinkedIn Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    },
    "Github Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    }
  },
}
