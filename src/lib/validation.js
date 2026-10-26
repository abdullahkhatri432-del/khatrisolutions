import { inquiryServiceKinds } from '../config/site'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
const PHONE_RE = /^[+\d][\d\s()-]{6,19}$/

export function isEmail(value) {
  return EMAIL_RE.test(String(value).trim())
}

export function isPhone(value) {
  return PHONE_RE.test(String(value).trim())
}

/** Accepts example.com or https://example.com; rejects bare words. */
export function isWebUrl(value) {
  const raw = clean(value)
  if (!raw || /\s/.test(raw)) return false
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return url.hostname.includes('.') && url.hostname.length > 3
  } catch {
    return false
  }
}

export function clean(value) {
  return String(value ?? '').trim()
}

/** Conditional questions required for each service kind. */
const STEP_ONE_FIELDS = {
  website: ['businessType', 'pages', 'existingWebsite'],
  ecommerce: ['productCount', 'commerceNeeds'],
  application: ['appProblem', 'userRoles', 'appFeatures'],
  automation: ['automationTask', 'currentTools'],
  redesign: ['currentWebsite', 'improvements'],
  unsure: ['businessType', 'primaryGoal'],
}

const STEP_TWO_FIELDS = ['name', 'email', 'phone', 'contactMethod']
const STEP_THREE_FIELDS = ['description', 'consent']

/** Field keys validated on a given step. Used for step-by-step validation. */
export function inquiryFieldKeys(service, step) {
  if (step === 1) {
    const kind = inquiryServiceKinds[service]
    return ['service', 'budget', 'timeline', ...(STEP_ONE_FIELDS[kind] || [])]
  }
  if (step === 2) return STEP_TWO_FIELDS
  if (step === 3) return STEP_THREE_FIELDS
  return []
}

function validateConditional(values, errors) {
  const kind = inquiryServiceKinds[clean(values.service)]
  if (!kind) return

  if (kind === 'website' || kind === 'unsure') {
    if (!clean(values.businessType)) errors.businessType = 'Please choose a business type.'
  }

  if (kind === 'website') {
    if (!clean(values.pages)) errors.pages = 'Please choose roughly how many pages you need.'
    if (clean(values.existingWebsite) && !isWebUrl(values.existingWebsite)) {
      errors.existingWebsite = 'Include the full address, e.g. https://example.com.'
    }
  }

  if (kind === 'ecommerce') {
    if (!clean(values.productCount)) errors.productCount = 'Please choose an approximate product count.'
    if (clean(values.commerceNeeds).length < 10) {
      errors.commerceNeeds = 'Tell us how payments and delivery should work (10+ characters).'
    }
  }

  if (kind === 'application') {
    if (clean(values.appProblem).length < 20) {
      errors.appProblem = 'Describe the problem the application should solve (20+ characters).'
    }
    if (clean(values.userRoles).length < 2) {
      errors.userRoles = 'List the user roles, e.g. admin, staff, customer.'
    }
    if (clean(values.appFeatures).length < 10) {
      errors.appFeatures = 'List the main features you need (10+ characters).'
    }
  }

  if (kind === 'automation') {
    if (clean(values.automationTask).length < 10) {
      errors.automationTask = 'Describe the task you want to automate (10+ characters).'
    }
    if (clean(values.currentTools).length < 2) {
      errors.currentTools = 'List the tools you use today, or write “None”.'
    }
  }

  if (kind === 'redesign') {
    if (!clean(values.currentWebsite)) {
      errors.currentWebsite = 'Please add the website you want to improve.'
    } else if (!isWebUrl(values.currentWebsite)) {
      errors.currentWebsite = 'Include the full address, e.g. https://example.com.'
    }
    if (clean(values.improvements).length < 10) {
      errors.improvements = 'Describe what you want to improve (10+ characters).'
    }
  }

  if (kind === 'unsure') {
    if (clean(values.primaryGoal).length < 10) {
      errors.primaryGoal = 'Describe the main goal for the website (10+ characters).'
    }
  }
}

/** Returns a map of field -> message. Empty object means valid. */
export function validateInquiry(values) {
  const errors = {}
  const service = clean(values.service)
  const name = clean(values.name)
  const business = clean(values.business)
  const email = clean(values.email)
  const phone = clean(values.phone)
  const description = clean(values.description)
  const method = clean(values.contactMethod)

  if (!service) errors.service = 'Please choose the service you need.'
  if (!clean(values.budget)) errors.budget = 'Please choose an approximate budget.'
  if (!clean(values.timeline)) errors.timeline = 'Please choose a timeline.'

  validateConditional(values, errors)

  if (name.length < 2) errors.name = 'Please enter your full name.'
  if (business.length > 120) errors.business = 'Please keep the business name under 120 characters.'

  if (email && !isEmail(email)) errors.email = 'That email address does not look right.'
  if (phone && !isPhone(phone)) errors.phone = 'Use digits only, e.g. +91 98765 43210.'

  if (!email && !phone) {
    errors.email = 'Add an email address or a phone number so we can reply.'
  }

  if (!method) {
    errors.contactMethod = 'Please choose how you would like us to reply.'
  } else if ((method === 'WhatsApp' || method === 'Phone call') && !phone) {
    errors.phone = email
      ? `Add a phone number for ${method === 'WhatsApp' ? 'WhatsApp' : 'a phone call'}, or choose Email as your preferred contact.`
      : `Add a phone number for ${method === 'WhatsApp' ? 'WhatsApp' : 'a phone call'}, or choose Email and add an email address.`
  } else if (method === 'Email' && !email) {
    errors.email = phone
      ? 'Add an email address, or change your preferred contact to WhatsApp or phone call.'
      : 'Add an email address, or choose WhatsApp or phone call and add a phone number.'
  }

  if (description.length < 20) {
    errors.description = 'Please add at least a couple of sentences (20+ characters).'
  } else if (description.length > 2000) {
    errors.description = 'Please keep the description under 2000 characters.'
  }

  if (!values.consent) errors.consent = 'Please accept the privacy notice to continue.'

  return errors
}

/** Only the errors that belong to the given step. */
export function validateInquiryStep(values, step) {
  const all = validateInquiry(values)
  const keys = inquiryFieldKeys(values.service, step)
  const stepErrors = {}
  for (const key of keys) {
    if (all[key]) stepErrors[key] = all[key]
  }
  return stepErrors
}

/** Lowest step that contains an error, so the form can jump back to it. */
export function firstInquiryStepWithErrors(values, errors) {
  for (const step of [1, 2, 3]) {
    if (inquiryFieldKeys(values.service, step).some((key) => errors[key])) return step
  }
  return 1
}

export function validateReview(values) {
  const errors = {}
  const name = clean(values.name)
  const quote = clean(values.quote)
  const rating = Number(values.rating)

  if (name.length < 2) errors.name = 'Please enter the name you want shown with the review.'
  if (!clean(values.projectType)) errors.projectType = 'Please choose the project type.'
  if (!rating || rating < 1 || rating > 5) errors.rating = 'Please choose a rating from 1 to 5.'
  if (quote.length < 20) errors.quote = 'Please write at least a couple of sentences.'
  else if (quote.length > 1000) errors.quote = 'Please keep the review under 1000 characters.'
  if (!values.permission) errors.permission = 'Please confirm we may publish the review.'

  return errors
}
