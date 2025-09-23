# Create redirects for blog posts using short slugs
posts <- list.dirs(path = here::here("blog"), full.names = FALSE, recursive = FALSE)
# Extract short slugs by removing date prefix (everything before and including last underscore)
slugs <- gsub("^.*_", "", posts)
# Create redirect lines for each post
post_redirects <- paste0("/", slugs, " ", "/blog/", posts)

# Create redirects for talks using short slugs
talks <- list.dirs(path = here::here("talks"), full.names = FALSE, recursive = FALSE)
# Extract short slugs by removing date prefix
talk_slugs <- gsub("^.*_", "", talks)
# Create redirect lines for each talk
talk_redirects <- paste0("/", talk_slugs, " ", "/talks/", talks)

# Combine all redirects
all_redirects <- c(
  "/talk /talks",
  "/presentations /talks",
  "/presentations/ /talks",
  "/post /blog",
  post_redirects,
  talk_redirects
)

# Write the _redirect file
writeLines(all_redirects, here::here("_site", "_redirects"))