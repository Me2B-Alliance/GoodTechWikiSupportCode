import { JSONSchema6 } from 'json-schema'
export const schema : JSONSchema6 = {
  "definitions":{
  },
  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Event",
  "type": "object",
  "required": [ ],
  "additionalProperties": false,
  "properties" : {
    "Name" : {
        "type": "string",
        "description": ""
    },
    "Description" : {
        "type": "string",
        "description": ""
    },
    "Website" : {
        "type": "string",
        "format":"url",
        "description": ""
    },
    "Category" : {
        "type": "string",
        "format":"url",
        "description": "",
        "enum": [
          "Size",
          "Identity",
          "Telco"
        ]
    },
    "Host Organization" : {
        "type": "string",
        "description": ""
    },
    "People" : {
        "type": "string",
        "description": ""
    },
    "Audience" : {
        "type": "string",
        "format":"url",
        "description": "",
        "enum": [
          "C suite decision makers",
          "consumer technology vendors",
          "enterprise technology vendors",
          "general public",
          "government workers",
          "legislators",
          "marginalized and diadvantaged communities",
          "product users",
          "researchers",
          "creators"
        ]
    },
    "Partners" : {
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
    "Frequency" : {
        "type": "string",
        "description": "how often the event occurs",
        "enum": [
          "daily",
          "weekly",
          "monthly",
          "quarterly",
          "other"
        ]
    },
    "Date" : {
        "type": "string",
        "format": "date",
        "description": ""
    },
    "Location(s)": {
        "type": "array",
        "description": "",
        "items": {
            "type":"string"
        }
    },
    "Github Profile": {
        "type": "string",
        "format": "url",
        "description": ""
    },
    "Relevant Publications" : {
        "type": "string",
        "description": "",
    }
  },
}
