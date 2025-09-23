# lines to insert to a netlify _redirect file
redirects <- paste0("/talk /presentations \n/talks /presentations \n/presentations/ /presentations \n/post /posts")

# write the _redirect file
writeLines(redirects, here::here("_site", "_redirects"))