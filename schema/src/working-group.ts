import { JSONSchema6 } from 'json-schema'

export const schema : JSONSchema6 = {
  "definitions":{
  },
  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Working Group",
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
    "URL" : {
        "type": "string",
        "format":"url",
        "description": ""
    },
    "Category" : {
        "type": "string",
        "format":"url",
        "description": "",
        "enum": [
          "Discussion Group",
          "w/in SDO working on a formal standard",
          "Community Group",
          "w/in (Inter)Government Organization",
          "w/in a Trade Association"
        ]
    },
    "Parent Org" : {
        "type": "string",
        "description": ""
    },
    "People" : {
        "type": "string",
        "description": ""
    },
    "Meeting Frequency" : {
        "type": "string",
        "description": "",
        "enum": [
          "weekly",
          "bi-weekly",
          "monthly",
          "quarterly",
          "semi-annually",
          "annually"
        ]
    },
    "Date Founded" : {
        "type": "string",
        "format": "date",
        "description": ""
    },
    "Date Ended" : {
        "type": "string",
        "format": "date",
        "description": ""
    },
    "Purpose": {
        "type": "string",
        "description": "",
        "enum": [
            "education",
            "human rights",
            "usability",
            "tech interoperability",
            "governance",
            "certification and compliance",
            "transparancy and accountability"
        ]
    },
    "Digital Harms Addressed": {
		"type": "string",
    	"enum": [
			"AGGREGATION",
			"APPROPRIATION",
			"BLACKMAIL",
			"BREACH OF CONFIDENTIALITY",
			"DECISIONAL INTERFERENCE",
			"DISCLOSURE",
			"DISTORTION",
			"EXCLUSION",
			"EXPOSURE",
			"IDENTIFICATION",
			"INCREASED ACCESSIBILITY",
			"INSECURITY",
			"INTERROGATION",
			"INTRUSION",
			"SECONDARY USE",
			"SURVEILLANCE"
		]
	},
    "Tech Focus": {
    	"type": "string",
    	"enum": [
    		"Identity",
    		"Data Mobility",
    		"Terms Management",
    		"Information Sharing Control",
    		"Data Storage"
    	]
    },
    "Activities" : {
        "type": "string",
        "description": "",
    },
    "Status" : {
        "type": "string",
        "description": "",
        "enum": [
          "active",
          "inactive"
        ]
    },
    "IPR" : {
        "type": "string",
        "description": "",
    },
    "Github Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    },
    "Relevant Standards" : {
        "type": "string",
        "description": "",
    }
  },
}
