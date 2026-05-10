/**
 * 22-country shortlist for the phone-code picker.
 * `iso` is the ISO 3166-1 alpha-2 code that libphonenumber-js consumes.
 * Order: UAE first (default), then GCC, then top source markets for UAE
 * business setup based on inbound traffic patterns.
 */

export interface Country {
  iso: string
  dial: string
  name: string
  flag: string
  /** National-format mobile example, used as input placeholder + error hint */
  example: string
}

export const COUNTRIES: Country[] = [
  { iso: "AE", dial: "+971", name: "United Arab Emirates", flag: "🇦🇪", example: "50 123 4567" },
  { iso: "SA", dial: "+966", name: "Saudi Arabia", flag: "🇸🇦", example: "50 123 4567" },
  { iso: "QA", dial: "+974", name: "Qatar", flag: "🇶🇦", example: "3312 3456" },
  { iso: "KW", dial: "+965", name: "Kuwait", flag: "🇰🇼", example: "500 12345" },
  { iso: "BH", dial: "+973", name: "Bahrain", flag: "🇧🇭", example: "3600 1234" },
  { iso: "OM", dial: "+968", name: "Oman", flag: "🇴🇲", example: "9212 3456" },
  { iso: "RU", dial: "+7", name: "Russia", flag: "🇷🇺", example: "912 345 67 89" },
  { iso: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧", example: "7400 123456" },
  { iso: "US", dial: "+1", name: "United States", flag: "🇺🇸", example: "201 555 0123" },
  { iso: "IN", dial: "+91", name: "India", flag: "🇮🇳", example: "81234 56789" },
  { iso: "PK", dial: "+92", name: "Pakistan", flag: "🇵🇰", example: "301 2345678" },
  { iso: "EG", dial: "+20", name: "Egypt", flag: "🇪🇬", example: "100 123 4567" },
  { iso: "TR", dial: "+90", name: "Türkiye", flag: "🇹🇷", example: "501 234 56 78" },
  { iso: "DE", dial: "+49", name: "Germany", flag: "🇩🇪", example: "1512 3456789" },
  { iso: "FR", dial: "+33", name: "France", flag: "🇫🇷", example: "6 12 34 56 78" },
  { iso: "IT", dial: "+39", name: "Italy", flag: "🇮🇹", example: "312 345 6789" },
  { iso: "ES", dial: "+34", name: "Spain", flag: "🇪🇸", example: "612 34 56 78" },
  { iso: "NL", dial: "+31", name: "Netherlands", flag: "🇳🇱", example: "6 12345678" },
  { iso: "CH", dial: "+41", name: "Switzerland", flag: "🇨🇭", example: "78 123 45 67" },
  { iso: "SG", dial: "+65", name: "Singapore", flag: "🇸🇬", example: "8123 4567" },
  { iso: "CN", dial: "+86", name: "China", flag: "🇨🇳", example: "131 2345 6789" },
  { iso: "IR", dial: "+98", name: "Iran", flag: "🇮🇷", example: "912 345 6789" },
]

export const DEFAULT_COUNTRY: Country = COUNTRIES[0]
