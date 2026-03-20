def get_instruction(types):
    mapping = {
        "tweets": "Create a 5-tweet thread (engaging, numbered, strong hook)",
        "linkedin": "Create a LinkedIn post (professional, storytelling style, spaced properly)",
        "email": "Create an email newsletter (include subject line, short paragraphs, and CTA)"
    }
    return "\n".join([mapping[t] for t in types])