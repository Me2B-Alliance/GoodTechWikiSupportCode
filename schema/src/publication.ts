import { JSONSchema6 } from 'json-schema'


export const schema : JSONSchema6 = {
  "definitions":{
  },
  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Publication",
  "type": "object",
  "required": [ ],
  "additionalProperties": false,
  "properties" : {
    "Name" : {
        "type": "string",
        "description": ""
    },
    "About" : {
        "type": "string",
        "description": ""
    },
    "URL" : {
        "type": "string",
        "format":"url",
        "description": ""
    },
    "Publication Type" : {
        "type": "string",
        "description": "",
        "enum": [
            "blog post",
            "book",
            "event summary or output",
            "glossary",
            "journal",
            "legal document",
            "license",
            "magazine",
            "news article",
            "op ed",
            "paper",
            "podcast",
            "report",
            "standard",
            "terms of service",
            "Trust Framework",
            "video"
        ]
    },
    "Sponsoring Org" : {
        "type": "string",
        "description": ""
    },
    "Author(s)/Editor(s)" : {
        "type": "array",

        "description": "",
        "items": {
            "type": "string"
        }
    },
    "Audience" : {
        "type": "string",
        "description": "",
        "enum": [
            "C suite decision makers",
            "consumer technology vendors",
            "enterprise technology vendors",
            "general public",
            "government workers",
            "legislators",
            "marginalized and disadvantage communities",
            "product users",
            "researchers"
        ]
    },
    "Working Group" : {
        "type": "string",
        "description": ""
    },
    "Tags" : {
        "type": "array",
        "description": "",
        "items": {
            "type": "string"
        }
    },
    "License" : {
        "type": "string",
        "description": ""
    },
    "Volume Frequency" : {
        "type": "string",
        "description": ""
    },
    "Version or Edition" : {
        "type": "string",

        "description": ""
    },
    "Date" : {
        "type": "string",
        "format": "date",
        "description": ""
    },
    "Sector" : {
        "type": "string",
        "description": "",
        "enum": [
        ]
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
    "Jurisdiction": {
    	"type": "string"
    },
    "Github Profile": {
    	"type": "string",
    	"format": "url"
    }
  },
}
