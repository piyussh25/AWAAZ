/**
 * Deterministic Matching Engine for Government Schemes
 * Evaluates a user profile against a list of schemes.
 * Returns lists of eligible, near-match, and ineligible schemes with reasons.
 */

export function matchSchemes(profile, schemesList) {
  const results = [];

  for (const scheme of schemesList) {
    const el = scheme.eligibility;
    const reasons = [];
    const missing = [];
    let isExcluded = false;
    let score = 100;
    
    // 1. Exclusions check (Hard blockers)
    if (el.exclusions) {
      if (el.exclusions.includes("government_employee") && profile.occupation === "government_employee") {
        reasons.push("Excluded: Scheme is not for government employees.");
        isExcluded = true;
      }
      if (el.exclusions.includes("income_tax_payer") && profile.is_income_tax_payer === true) {
        reasons.push("Excluded: Scheme is not for income tax payers.");
        isExcluded = true;
      }
      if (el.exclusions.includes("lpg_connection_holder") && profile.has_lpg_connection === true) {
        reasons.push("Excluded: Already have an active LPG connection.");
        isExcluded = true;
      }
      if (el.exclusions.includes("pucca_house_owner") && profile.owns_pucca_house === true) {
        reasons.push("Excluded: Scheme requires not owning a pucca house.");
        isExcluded = true;
      }
      if (el.exclusions.includes("provident_fund_member") && profile.is_epfo_member === true) {
        reasons.push("Excluded: EPFO/PF members are not eligible.");
        isExcluded = true;
      }
      if (el.exclusions.includes("esic_member") && profile.is_esic_member === true) {
        reasons.push("Excluded: ESIC members are not eligible.");
        isExcluded = true;
      }
    }

    if (isExcluded) {
      results.push({
        scheme,
        status: "ineligible",
        score: 0,
        reasons,
        missing
      });
      continue;
    }

    // 2. Gender check
    if (el.gender && el.gender.length > 0) {
      if (profile.gender) {
        if (!el.gender.includes(profile.gender.toLowerCase())) {
          reasons.push(`This scheme is specifically for ${el.gender.join("/")} applicants.`);
          score -= 40;
        } else {
          reasons.push("Gender eligibility matches.");
        }
      } else {
        // Gender is unknown, mark as potential missing info
        missing.push("Confirm gender (scheme is for " + el.gender.join("/") + ")");
        score -= 15;
      }
    }

    // 3. Age check
    if (el.min_age !== null || el.max_age !== null) {
      if (profile.age !== null && profile.age !== undefined) {
        if (el.min_age !== null && profile.age < el.min_age) {
          reasons.push(`Age is ${profile.age}, but the minimum required age is ${el.min_age} years.`);
          score -= 30;
        } else if (el.max_age !== null && profile.age > el.max_age) {
          reasons.push(`Age is ${profile.age}, but the maximum allowed age is ${el.max_age} years.`);
          score -= 30;
        } else {
          reasons.push("Age requirement matches.");
        }
      } else {
        missing.push("Confirm age");
        score -= 10;
      }
    }

    // 4. Occupation check
    if (el.occupations && el.occupations.length > 0) {
      if (profile.occupation) {
        // Match specific occupations or general classifications
        const userOcc = profile.occupation.toLowerCase();
        const matchesOccupation = el.occupations.some(o => 
          userOcc.includes(o) || o.includes(userOcc)
        );

        if (!matchesOccupation) {
          reasons.push(`Scheme is designed for ${el.occupations.join("/")}, but your occupation is recorded as ${profile.occupation}.`);
          score -= 40;
        } else {
          reasons.push(`Occupation matches (${profile.occupation}).`);
        }
      } else {
        missing.push("Confirm occupation (scheme is for " + el.occupations.join("/") + ")");
        score -= 20;
      }
    }

    // 5. Land Ownership check
    if (el.land_ownership !== null) {
      if (profile.land_ownership !== null && profile.land_ownership !== undefined) {
        if (el.land_ownership === true && profile.land_ownership === false) {
          reasons.push("Requires owning cultivable agricultural land, but you are recorded as landless.");
          score -= 35;
        } else if (el.land_ownership === false && profile.land_ownership === true) {
          reasons.push("Requires being landless or not owning land, but you own land.");
          score -= 30;
        } else {
          reasons.push(el.land_ownership ? "Owns required land." : "Landless status fits requirement.");
        }
      } else {
        missing.push("Confirm land ownership status");
        score -= 15;
      }
    }

    // 6. Income check
    if (el.max_income !== null) {
      if (profile.income_bracket !== null && profile.income_bracket !== undefined) {
        if (profile.income_bracket > el.max_income) {
          reasons.push(`Income (₹${profile.income_bracket}/month) is higher than the maximum limit of ₹${el.max_income}/month.`);
          score -= 30;
        } else {
          reasons.push(`Income fits within the limit (₹${profile.income_bracket} <= ₹${el.max_income}/month).`);
        }
      } else {
        // Don't penalize too heavily if we just don't know the income yet
        missing.push("Confirm monthly income");
        score -= 10;
      }
    }

    // 7. BPL check
    if (el.bpl !== null) {
      if (profile.bpl !== null && profile.bpl !== undefined) {
        if (el.bpl === true && profile.bpl === false) {
          reasons.push("Requires Below Poverty Line (BPL) status or Ration Card.");
          score -= 25;
        } else {
          reasons.push("BPL status matches.");
        }
      } else {
        missing.push("Confirm BPL card / Ration Card status");
        score -= 10;
      }
    }

    // 8. Marital Status check
    if (el.marital_status) {
      if (profile.marital_status) {
        if (el.marital_status !== profile.marital_status.toLowerCase()) {
          reasons.push(`Scheme requires marital status to be '${el.marital_status}', but you are '${profile.marital_status}'.`);
          score -= 50;
        } else {
          reasons.push(`Marital status matches (${profile.marital_status}).`);
        }
      } else {
        missing.push("Confirm marital status");
        score -= 15;
      }
    }

    // 9. Document availability checks (Soft modifiers)
    if (profile.has_aadhaar === false) {
      missing.push("Needs Aadhaar Card");
      score -= 5;
    }
    if (profile.has_bank_account === false) {
      missing.push("Needs active savings bank account");
      score -= 5;
    }

    // Determine overall status based on final score
    let status = "ineligible";
    if (score >= 90 && missing.length === 0) {
      status = "eligible";
    } else if (score >= 50) {
      status = "near_match";
    }

    // Formatting fallback summary for ui
    if (reasons.length === 0) {
      reasons.push("Meets general criteria.");
    }

    results.push({
      scheme,
      status,
      score: Math.max(0, score),
      reasons: reasons.filter(Boolean),
      missing: missing.filter(Boolean)
    });
  }

  // Sort: Eligible first (highest score), then Near Match, then Ineligible
  return results.sort((a, b) => b.score - a.score);
}
