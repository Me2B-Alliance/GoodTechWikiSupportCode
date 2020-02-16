import { JSONSchema6 } from 'json-schema'

export const tiddler_schema = {
  element_type:'organization',
  fields:{
    "org.name": {
      type: "string",
      required: true,
      title: "Organization Name"
    },
    "about": {
      type: "string",
      required: false,
      default: '',
      title: "Description"
    },
    "website": {
      type: "url",
      required: false,
      default: undefined,
      title: "WebSite URL"
    },
    "org.type": {
      type: "element_subtype",
      required: false,
      default: 'to-be-determined',
      title: "Organization Type"
    },
    "sector": {
      type: "select-single",
      required: false,
      default: undefined,
      title: "Sector"
    },
    "purpose": {
      type: "tags-array",
      required: false,
      default: undefined,
      title: "Purpose"
    },
    "activities": {
      type: "tags-array",
      required: false,
      default: undefined,
      title: "Activities"
    },
    "parent.org": {
      type: "title-array",
      target: 'organization',
      required: false,
      default: undefined,
      title: "Parent Org"
    },
    "me2b.relationship": {
      type: "tags-array",
      required: false,
      default: undefined,
      title: "Me2B Relationship"
    },
    "key.people": {
      type: "title-array",
      target: 'person',
      required: false,
      default: undefined,
      title: "Key People"
    },
    "audience": {
      type: "tags-array",
      required: false,
      default: undefined,
      title: "Audience"
    },
    "tags": {
      type: "tags-array",
      required: false,
      default: undefined,
      title: "Tags"
    },
    "partners": {
      type: "title-array",
      target: 'organization',
      required: false,
      default: undefined,
      title: "Partners"
    },
    "date.founded": {
      type: "date",
      required: false,
      default: undefined,
      title: "Date Founded"
    },
    "date.ended": {
      type: "date",
      required: false,
      default: undefined,
      title: "Date Founded"
    },
    "digital.harms.addressed": {
      type: "tags-array",
      required: false,
      default: undefined,
      title: "Digital Harms Addressed"
    },
    "tech.focus": {
      type: "tags-array",
      required: false,
      default: undefined,
      title: "Tech Focus"
    },
    "status": {
      type: "select-single",
      required: false,
      default: undefined,
      title: "Status"
    },
    "annual.budget": {
      type: "string",
      required: false,
      default: undefined,
      title: "Annual Budget"
    },
    "funding": {
      type: "string",
      required: false,
      default: undefined,
      title: "Annual Budget"
    },
    "scope": {
      type: "select-single",
      required: false,
      default: undefined,
      title: "Status"
    },
    "locations": {
      type: "title-array",
      target: 'location',
      required: false,
      default: undefined,
      title: "Location(s)"
    },
    "products-or-services": {
      type: "title-array",
      target: 'product-or-service',
      required: false,
      default: undefined,
      title: "Products and or services"
    },
    "twitter.profile": {
      type: "url",
      required: false,
      default: undefined,
      title: "Twitter Profile"
    },
    "linkedin.profile": {
      type: "string",
      required: false,
      default: undefined,
      title: "LinkedIn Profile"
    },
    "github.profile": {
      type: "string",
      required: false,
      default: undefined,
      title: "LinkedIn Profile"
    },
    "relevant.publications": {
      type: "title-array",
      target: 'publication',
      required: false,
      default: undefined,
      title: "Relevant Publications"
    },
  }
}

export const schema : JSONSchema6 = {
  "definitions":{
  },
  "$id": "https://example.com/organization.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Organization",
  "type": "object",
  "properties": {
    "Org Name": {
    	type: "string",
      title: "Organization Name"
    },
    "About": {
    	"type": "string"
    },
    "Website": {
    	"type": "string",
    	"format": "url"
    },
    "Org Type": {
    	"type": "string",
    	"enum": [
    		"Coalition or Network",
    		"Government Department",
    		"Research Lab or Center",
    		"University",
    		"Standards Development Organization",
    		"TradeAssociation",
    		"University Department",
			"Non Governmental Organization",
			"Part of Supra-National Government",
			"Government",
			"Cooperative"
    	]
    },
    "Sector": {
    	"type": "string",
    	"enum": [
    		"non-profit",
    		"for-profit",
    		"government",
    		"academic"
    	]
    },
    "Purpose": {
      "type": "string",
      "enum": [
        "education",
        "human rights",
        "usability",
        "tech interoperability",
        "governance",
        "certification and compliance",
        "transparency and accountability",
        "consumer support",
        "health care"
      ]
    },
    "Activities": {
    	"type": "string",
    	"enum": [
    		"advocacy",
    		"certification",
    		"compliance auditing",
    		"events and convening",
    		"formal training and classes",
    		"funding",
    		"incubation",
    		"movement building",
    		"outreach",
    		"policy development",
    		"publication",
    		"regulation",
    		"research",
    		"software development",
    		"standard development",
        "service provider"
    	]
    },
    "Parent Org": {
    	"type": "string"
    },
    "Me2B Relationship": {
    	"type": "string",
    	"enum": [
          "Certification Candidate",
          "collaborating org",
          "member",
          "potential collaborator",
          "out of scope",
          "funder",
          "affiliates"
        	]
	   },
    "Key People": {
    	"type": "string",
    	"enum": [
    		"Board People",
    		"CEO or ED",
    		"Other Leadership",
    		"Working group chair",
        "Technical editor",
        "Employee"
    	]
    },
    "Audience": {
    	"type": "string",
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
    "Partners": {
		"type": "array",
		"maxItems": 5,
		"items": {
			"type": "string"
			}
	 },
    "Tags": {
		"type": "array",
		"items": {
			"type": "string"
			}
    },
    "Date Founded": {
    	"type": "string",
    	"format": "date"
    },
    "Date Ended": {
    	"type": "string",
    	"format": "date"
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
    "Status": {
    	"type": "string",
    	"enum": [
    		"active",
    		"inactive",
    		"merged"
    	]
    },
	"Annual Budget": {
    	"type": "string"
	},
	"Funding": {
    	"type": "string"
	},
    "Scope": {
    	"type": "string",
    	"enum": [
    		"global",
    		"national",
    		"regional",
    		"local",
    		"other"
    	]
    },
    "Location(s)": {
    	"type": "string"
    },
    "Products and or services": {
		"type": "array",
		"items": {
			"type": "string"
		}
    },
    "Twitter Profile": {
    	"type": "string",
    	"format": "url"
    },
    "LinkedIn Profile": {
    	"type": "string",
    	"format": "url"
    },
    "Github Profile": {
    	"type": "string",
    	"format": "url"
    },
    "Relevant Publications": {
    	"type": "string"
    }
  }
}
