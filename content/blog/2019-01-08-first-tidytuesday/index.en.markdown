---
aliases: 
  - /blog/first-tidytuesday
  - /blog/2019-01-08-first-tidytuesday
title: First TidyTuesday submission
authors: [jeremy]
date: '2019-01-08'
layout: single-sidebar
tags: ["TidyTuesday", "data wrangling", "data viz", "R"]
categories: ["Blog"]
summary: 'A walkthrough of my first #TidyTuesday contribution.'
output:
  blogdown::html_page:
    toc: true
    number_sections: true
    toc_depth: 1
---

It’s been quite some time since I’ve written here, so I thought I would use one my of [2019 \#rstats goals](https://twitter.com/_jwinget/status/1079437460357218304) as an excuse to brush off the dust.

In this post, I write about my **first** [\#tidytuesday](https://github.com/rfordatascience/tidytuesday/tree/master/data/2019/2019-01-08) submission of the Economist’s “TV’s golden age is real” data set (original \#tidytuesday code [here](https://gitlab.com/jrwinget/tidy-tuesday/blob/master/2019-01-08_tv-golden-age.Rmd)). I also make a few improvements to some of the graphs and add tables with the `gt` package.

Special thanks to [Isabella Ghement](https://twitter.com/IsabellaGhement) for providing [a few tips](https://twitter.com/IsabellaGhement/status/1082831866523086849) on how to improve the original graphs!

First, load the required packages and data:

``` r
library(tidyverse)
library(lubridate)
library(ggpmisc)
library(ggrepel)
library(gt)
tv_rating <- read_csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-01-08/IMDb_Economist_tv_ratings.csv")
```

### Which years had the highest ratings?

``` r
tv_rating %>%
  mutate(year = year(date)) %>%
  group_by(year) %>%
  summarize(
    n = n(),
    avg_rating = mean(av_rating)
  ) %>%
  filter(n > 25) %>%
  arrange(desc(avg_rating)) %>%
  ggplot() +
  aes(year, avg_rating) +
  geom_point() +
  geom_smooth(
    formula = y ~ x,
    method = "lm",
    se = FALSE,
    color = "red"
  ) +
  labs(
    title = "Which years had the highest ratings?",
    x = "Year",
    y = "Average rating"
  ) +
  stat_poly_eq(aes(label = paste("atop(", ..eq.label.., ",", ..adj.rr.label.., ")")),
    formula = y ~ x, color = "red", parse = TRUE
  ) +
  theme_light()
```

<img src="{{< blogdown/postref >}}index.en_files/figure-html/unnamed-chunk-2-1.png" width="672" />

Looks like the newer the TV drama, the more likely it was to have a higher rating. Maybe some of this is variance is due to shows with multiple seasons. Let’s see how this changes when looking at individual shows and their respective run lengths.

### Which titles had the highest ratings, and how long did they run?

``` r
titles <- tv_rating %>%
  group_by(title) %>%
  summarize(
    n = n(),
    first_yr = min(year(date)),
    last_yr = max(year(date)),
    num_seasons = max(seasonNumber),
    yrs_aired = (max(year(date) - min(year(date)))),
    avg_rating = mean(av_rating)
  ) %>%
  filter(n > 10) %>% # not enough cases to filter by 25 ratings per title
  arrange(desc(avg_rating))

# highest rated titles' run lengths
titles %>%
  mutate(title = fct_reorder(title, yrs_aired)) %>%
  ggplot() +
  aes(title, yrs_aired, fill = title) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Most popular series' run lengths",
    x = "TV Series Title",
    y = "Number of years aired"
  ) +
  theme_light() +
  theme(legend.position = "none")
```

<img src="{{< blogdown/postref >}}index.en_files/figure-html/unnamed-chunk-3-1.png" width="672" />

``` r
# highest rated titles rating over time
titles %>%
  ggplot() +
  aes(yrs_aired, avg_rating) +
  geom_point() +
  geom_smooth(
    formula = y ~ x,
    method = "lm",
    se = FALSE,
    color = "red"
  ) +
  labs(
    title = "Most popular series' ratings over time",
    x = "Number of years ran",
    y = "Average rating"
  ) +
  stat_poly_eq(aes(label = paste("atop(", ..eq.label.., ",", ..adj.rr.label.., ")")),
    formula = y ~ x, color = "red", parse = TRUE
  ) +
  theme_light()
```

<img src="{{< blogdown/postref >}}index.en_files/figure-html/unnamed-chunk-3-2.png" width="672" />

I haven’t seen all of these shows, but for the most part, their titles seem to describe suspenseful dramas (e.g., mystery, crime, maybe even thriller/horror). However, King of the Hill doesn’t really fit this description, so let’s take a look at the genre variable. Keeping in mind that all of these shows are dramas, I’m conceptualizing these as sub-genres of drama.

### Which sub-genres are most popular?

``` r
top_ratings <- function(df, x) {
  df %>%
    summarize(
      n = n(),
      avg_rating = mean(av_rating),
      med_rating = median(av_rating)
    ) %>%
    filter(n > 25) %>%
    arrange(desc(med_rating))
}

tv_rating %>%
  group_by(genres) %>%
  top_ratings() %>%
  mutate(genres = str_replace_all(genres, ",", ", ")) %>%
  gt() %>%
  tab_header(title = "Which drama sub-genres are most popular?") %>%
  fmt_number(
    columns = vars(avg_rating, med_rating),
    decimals = 3
  ) %>%
  cols_label(
    genres = "Sub-genres",
    n = "Number of responses",
    avg_rating = "Average rating",
    med_rating = "Median rating"
  )
```

<div id="eyxdwcdvub" style="overflow-x:auto;overflow-y:auto;width:auto;height:auto;">
<style>html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', 'Fira Sans', 'Droid Sans', Arial, sans-serif;
}

#eyxdwcdvub .gt_table {
  display: table;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  color: #333333;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  background-color: #FFFFFF;
  width: auto;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #A8A8A8;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #A8A8A8;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
}

#eyxdwcdvub .gt_heading {
  background-color: #FFFFFF;
  text-align: center;
  border-bottom-color: #FFFFFF;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}

#eyxdwcdvub .gt_title {
  color: #333333;
  font-size: 125%;
  font-weight: initial;
  padding-top: 4px;
  padding-bottom: 4px;
  border-bottom-color: #FFFFFF;
  border-bottom-width: 0;
}

#eyxdwcdvub .gt_subtitle {
  color: #333333;
  font-size: 85%;
  font-weight: initial;
  padding-top: 0;
  padding-bottom: 6px;
  border-top-color: #FFFFFF;
  border-top-width: 0;
}

#eyxdwcdvub .gt_bottom_border {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}

#eyxdwcdvub .gt_col_headings {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}

#eyxdwcdvub .gt_col_heading {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 6px;
  padding-left: 5px;
  padding-right: 5px;
  overflow-x: hidden;
}

#eyxdwcdvub .gt_column_spanner_outer {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 4px;
  padding-right: 4px;
}

#eyxdwcdvub .gt_column_spanner_outer:first-child {
  padding-left: 0;
}

#eyxdwcdvub .gt_column_spanner_outer:last-child {
  padding-right: 0;
}

#eyxdwcdvub .gt_column_spanner {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 5px;
  overflow-x: hidden;
  display: inline-block;
  width: 100%;
}

#eyxdwcdvub .gt_group_heading {
  padding: 8px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
}

#eyxdwcdvub .gt_empty_group_heading {
  padding: 0.5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: middle;
}

#eyxdwcdvub .gt_from_md > :first-child {
  margin-top: 0;
}

#eyxdwcdvub .gt_from_md > :last-child {
  margin-bottom: 0;
}

#eyxdwcdvub .gt_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 10px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  overflow-x: hidden;
}

#eyxdwcdvub .gt_stub {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 12px;
}

#eyxdwcdvub .gt_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

#eyxdwcdvub .gt_first_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
}

#eyxdwcdvub .gt_grand_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

#eyxdwcdvub .gt_first_grand_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: double;
  border-top-width: 6px;
  border-top-color: #D3D3D3;
}

#eyxdwcdvub .gt_striped {
  background-color: rgba(128, 128, 128, 0.05);
}

#eyxdwcdvub .gt_table_body {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}

#eyxdwcdvub .gt_footnotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}

#eyxdwcdvub .gt_footnote {
  margin: 0px;
  font-size: 90%;
  padding: 4px;
}

#eyxdwcdvub .gt_sourcenotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}

#eyxdwcdvub .gt_sourcenote {
  font-size: 90%;
  padding: 4px;
}

#eyxdwcdvub .gt_left {
  text-align: left;
}

#eyxdwcdvub .gt_center {
  text-align: center;
}

#eyxdwcdvub .gt_right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

#eyxdwcdvub .gt_font_normal {
  font-weight: normal;
}

#eyxdwcdvub .gt_font_bold {
  font-weight: bold;
}

#eyxdwcdvub .gt_font_italic {
  font-style: italic;
}

#eyxdwcdvub .gt_super {
  font-size: 65%;
}

#eyxdwcdvub .gt_footnote_marks {
  font-style: italic;
  font-weight: normal;
  font-size: 65%;
}
</style>
<table class="gt_table">
  <thead class="gt_header">
    <tr>
      <th colspan="4" class="gt_heading gt_title gt_font_normal gt_bottom_border" style>Which drama sub-genres are most popular?</th>
    </tr>
    
  </thead>
  <thead class="gt_col_headings">
    <tr>
      <th class="gt_col_heading gt_columns_bottom_border gt_left" rowspan="1" colspan="1">Sub-genres</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Number of responses</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Average rating</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Median rating</th>
    </tr>
  </thead>
  <tbody class="gt_table_body">
    <tr><td class="gt_row gt_left">Drama, Fantasy, Horror</td>
<td class="gt_row gt_right">56</td>
<td class="gt_row gt_right">8.341</td>
<td class="gt_row gt_right">8.505</td></tr>
    <tr><td class="gt_row gt_left">Crime, Drama, Thriller</td>
<td class="gt_row gt_right">63</td>
<td class="gt_row gt_right">8.390</td>
<td class="gt_row gt_right">8.409</td></tr>
    <tr><td class="gt_row gt_left">Action, Crime, Drama</td>
<td class="gt_row gt_right">146</td>
<td class="gt_row gt_right">8.156</td>
<td class="gt_row gt_right">8.282</td></tr>
    <tr><td class="gt_row gt_left">Crime, Drama</td>
<td class="gt_row gt_right">107</td>
<td class="gt_row gt_right">8.267</td>
<td class="gt_row gt_right">8.268</td></tr>
    <tr><td class="gt_row gt_left">Drama, Thriller</td>
<td class="gt_row gt_right">27</td>
<td class="gt_row gt_right">8.028</td>
<td class="gt_row gt_right">8.192</td></tr>
    <tr><td class="gt_row gt_left">Drama, Fantasy, Mystery</td>
<td class="gt_row gt_right">32</td>
<td class="gt_row gt_right">8.143</td>
<td class="gt_row gt_right">8.162</td></tr>
    <tr><td class="gt_row gt_left">Drama</td>
<td class="gt_row gt_right">168</td>
<td class="gt_row gt_right">8.001</td>
<td class="gt_row gt_right">8.160</td></tr>
    <tr><td class="gt_row gt_left">Adventure, Drama, Fantasy</td>
<td class="gt_row gt_right">27</td>
<td class="gt_row gt_right">8.107</td>
<td class="gt_row gt_right">8.145</td></tr>
    <tr><td class="gt_row gt_left">Drama, Mystery, Sci-Fi</td>
<td class="gt_row gt_right">58</td>
<td class="gt_row gt_right">8.061</td>
<td class="gt_row gt_right">8.113</td></tr>
    <tr><td class="gt_row gt_left">Comedy, Drama, Family</td>
<td class="gt_row gt_right">43</td>
<td class="gt_row gt_right">8.008</td>
<td class="gt_row gt_right">8.110</td></tr>
    <tr><td class="gt_row gt_left">Comedy, Crime, Drama</td>
<td class="gt_row gt_right">80</td>
<td class="gt_row gt_right">8.022</td>
<td class="gt_row gt_right">8.094</td></tr>
    <tr><td class="gt_row gt_left">Comedy, Drama</td>
<td class="gt_row gt_right">174</td>
<td class="gt_row gt_right">8.021</td>
<td class="gt_row gt_right">8.087</td></tr>
    <tr><td class="gt_row gt_left">Crime, Drama, Mystery</td>
<td class="gt_row gt_right">369</td>
<td class="gt_row gt_right">7.991</td>
<td class="gt_row gt_right">8.049</td></tr>
    <tr><td class="gt_row gt_left">Action, Adventure, Drama</td>
<td class="gt_row gt_right">112</td>
<td class="gt_row gt_right">8.020</td>
<td class="gt_row gt_right">7.975</td></tr>
    <tr><td class="gt_row gt_left">Comedy, Drama, Romance</td>
<td class="gt_row gt_right">76</td>
<td class="gt_row gt_right">7.973</td>
<td class="gt_row gt_right">7.962</td></tr>
    <tr><td class="gt_row gt_left">Action, Drama, Sci-Fi</td>
<td class="gt_row gt_right">28</td>
<td class="gt_row gt_right">8.046</td>
<td class="gt_row gt_right">7.943</td></tr>
    <tr><td class="gt_row gt_left">Animation, Comedy, Drama</td>
<td class="gt_row gt_right">28</td>
<td class="gt_row gt_right">8.040</td>
<td class="gt_row gt_right">7.918</td></tr>
    <tr><td class="gt_row gt_left">Drama, Romance</td>
<td class="gt_row gt_right">86</td>
<td class="gt_row gt_right">7.834</td>
<td class="gt_row gt_right">7.876</td></tr>
  </tbody>
  
  
</table>
</div>

These results provide some evidence of my initial impression: People tend to give higher ratings to suspenseful-like dramas (e.g., crime, thriller, horror, mystery, action). But, there’s not much variability between the values. This might be because many of the values in ‘genres’ are grouped together. Combining genres like this could hide underlying patterns among the sub-genres, so let’s split the genres variable up such that each sub-genre has its own row.

``` r
genre_split <- tv_rating %>%
  mutate(genres = str_split(genres, pattern = ",")) %>%
  unnest()
```

### After splitting up ‘genres,’ which sub-genres are most popular?

``` r
genre_split %>%
  group_by(genres) %>%
  top_ratings() %>%
  gt() %>%
  tab_header(title = "Which sub-genres are most popular?") %>%
  fmt_number(
    columns = vars(avg_rating, med_rating),
    decimals = 3
  ) %>%
  cols_label(
    genres = "Sub-genres",
    n = "Number of responses",
    avg_rating = "Average rating",
    med_rating = "Median rating"
  )
```

<div id="vevxyumkfd" style="overflow-x:auto;overflow-y:auto;width:auto;height:auto;">
<style>html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', 'Fira Sans', 'Droid Sans', Arial, sans-serif;
}

#vevxyumkfd .gt_table {
  display: table;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  color: #333333;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  background-color: #FFFFFF;
  width: auto;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #A8A8A8;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #A8A8A8;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
}

#vevxyumkfd .gt_heading {
  background-color: #FFFFFF;
  text-align: center;
  border-bottom-color: #FFFFFF;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}

#vevxyumkfd .gt_title {
  color: #333333;
  font-size: 125%;
  font-weight: initial;
  padding-top: 4px;
  padding-bottom: 4px;
  border-bottom-color: #FFFFFF;
  border-bottom-width: 0;
}

#vevxyumkfd .gt_subtitle {
  color: #333333;
  font-size: 85%;
  font-weight: initial;
  padding-top: 0;
  padding-bottom: 6px;
  border-top-color: #FFFFFF;
  border-top-width: 0;
}

#vevxyumkfd .gt_bottom_border {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}

#vevxyumkfd .gt_col_headings {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}

#vevxyumkfd .gt_col_heading {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 6px;
  padding-left: 5px;
  padding-right: 5px;
  overflow-x: hidden;
}

#vevxyumkfd .gt_column_spanner_outer {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 4px;
  padding-right: 4px;
}

#vevxyumkfd .gt_column_spanner_outer:first-child {
  padding-left: 0;
}

#vevxyumkfd .gt_column_spanner_outer:last-child {
  padding-right: 0;
}

#vevxyumkfd .gt_column_spanner {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 5px;
  overflow-x: hidden;
  display: inline-block;
  width: 100%;
}

#vevxyumkfd .gt_group_heading {
  padding: 8px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
}

#vevxyumkfd .gt_empty_group_heading {
  padding: 0.5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: middle;
}

#vevxyumkfd .gt_from_md > :first-child {
  margin-top: 0;
}

#vevxyumkfd .gt_from_md > :last-child {
  margin-bottom: 0;
}

#vevxyumkfd .gt_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 10px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  overflow-x: hidden;
}

#vevxyumkfd .gt_stub {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 12px;
}

#vevxyumkfd .gt_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

#vevxyumkfd .gt_first_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
}

#vevxyumkfd .gt_grand_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

#vevxyumkfd .gt_first_grand_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: double;
  border-top-width: 6px;
  border-top-color: #D3D3D3;
}

#vevxyumkfd .gt_striped {
  background-color: rgba(128, 128, 128, 0.05);
}

#vevxyumkfd .gt_table_body {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}

#vevxyumkfd .gt_footnotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}

#vevxyumkfd .gt_footnote {
  margin: 0px;
  font-size: 90%;
  padding: 4px;
}

#vevxyumkfd .gt_sourcenotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}

#vevxyumkfd .gt_sourcenote {
  font-size: 90%;
  padding: 4px;
}

#vevxyumkfd .gt_left {
  text-align: left;
}

#vevxyumkfd .gt_center {
  text-align: center;
}

#vevxyumkfd .gt_right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

#vevxyumkfd .gt_font_normal {
  font-weight: normal;
}

#vevxyumkfd .gt_font_bold {
  font-weight: bold;
}

#vevxyumkfd .gt_font_italic {
  font-style: italic;
}

#vevxyumkfd .gt_super {
  font-size: 65%;
}

#vevxyumkfd .gt_footnote_marks {
  font-style: italic;
  font-weight: normal;
  font-size: 65%;
}
</style>
<table class="gt_table">
  <thead class="gt_header">
    <tr>
      <th colspan="4" class="gt_heading gt_title gt_font_normal gt_bottom_border" style>Which sub-genres are most popular?</th>
    </tr>
    
  </thead>
  <thead class="gt_col_headings">
    <tr>
      <th class="gt_col_heading gt_columns_bottom_border gt_left" rowspan="1" colspan="1">Sub-genres</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Number of responses</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Average rating</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Median rating</th>
    </tr>
  </thead>
  <tbody class="gt_table_body">
    <tr><td class="gt_row gt_left">Sport</td>
<td class="gt_row gt_right">29</td>
<td class="gt_row gt_right">8.339</td>
<td class="gt_row gt_right">8.381</td></tr>
    <tr><td class="gt_row gt_left">History</td>
<td class="gt_row gt_right">62</td>
<td class="gt_row gt_right">8.274</td>
<td class="gt_row gt_right">8.343</td></tr>
    <tr><td class="gt_row gt_left">Music</td>
<td class="gt_row gt_right">32</td>
<td class="gt_row gt_right">8.186</td>
<td class="gt_row gt_right">8.291</td></tr>
    <tr><td class="gt_row gt_left">Thriller</td>
<td class="gt_row gt_right">160</td>
<td class="gt_row gt_right">8.169</td>
<td class="gt_row gt_right">8.256</td></tr>
    <tr><td class="gt_row gt_left">Fantasy</td>
<td class="gt_row gt_right">223</td>
<td class="gt_row gt_right">8.197</td>
<td class="gt_row gt_right">8.212</td></tr>
    <tr><td class="gt_row gt_left">Horror</td>
<td class="gt_row gt_right">124</td>
<td class="gt_row gt_right">8.093</td>
<td class="gt_row gt_right">8.211</td></tr>
    <tr><td class="gt_row gt_left">Family</td>
<td class="gt_row gt_right">76</td>
<td class="gt_row gt_right">8.063</td>
<td class="gt_row gt_right">8.179</td></tr>
    <tr><td class="gt_row gt_left">Crime</td>
<td class="gt_row gt_right">822</td>
<td class="gt_row gt_right">8.101</td>
<td class="gt_row gt_right">8.144</td></tr>
    <tr><td class="gt_row gt_left">Drama</td>
<td class="gt_row gt_right">2266</td>
<td class="gt_row gt_right">8.061</td>
<td class="gt_row gt_right">8.115</td></tr>
    <tr><td class="gt_row gt_left">Mystery</td>
<td class="gt_row gt_right">558</td>
<td class="gt_row gt_right">8.020</td>
<td class="gt_row gt_right">8.099</td></tr>
    <tr><td class="gt_row gt_left">Action</td>
<td class="gt_row gt_right">387</td>
<td class="gt_row gt_right">8.085</td>
<td class="gt_row gt_right">8.099</td></tr>
    <tr><td class="gt_row gt_left">Comedy</td>
<td class="gt_row gt_right">516</td>
<td class="gt_row gt_right">8.040</td>
<td class="gt_row gt_right">8.074</td></tr>
    <tr><td class="gt_row gt_left">Biography</td>
<td class="gt_row gt_right">29</td>
<td class="gt_row gt_right">8.111</td>
<td class="gt_row gt_right">8.072</td></tr>
    <tr><td class="gt_row gt_left">Adventure</td>
<td class="gt_row gt_right">204</td>
<td class="gt_row gt_right">8.024</td>
<td class="gt_row gt_right">8.033</td></tr>
    <tr><td class="gt_row gt_left">Romance</td>
<td class="gt_row gt_right">235</td>
<td class="gt_row gt_right">7.976</td>
<td class="gt_row gt_right">7.997</td></tr>
    <tr><td class="gt_row gt_left">Sci-Fi</td>
<td class="gt_row gt_right">154</td>
<td class="gt_row gt_right">7.925</td>
<td class="gt_row gt_right">7.927</td></tr>
    <tr><td class="gt_row gt_left">Animation</td>
<td class="gt_row gt_right">36</td>
<td class="gt_row gt_right">8.002</td>
<td class="gt_row gt_right">7.891</td></tr>
  </tbody>
  
  
</table>
</div>

Still, very little variability between sub-genres. The overall difference between the the highest (‘Sport’) and lowest (‘Animation’) rating is around 0.49. Nevertheless, these results paint a different picture than when all of the sub-genres were grouped together.

Now, it looks like sports, history, and music are the highest rated sub-genres, and not the suspenseful ones (i.e., crime, thriller, and horror) we saw earlier. To be fair, these new sub-genres could very well be suspenseful, but they seem to be of a slightly different “theme” than the former ones.

This raises a good point: Within the dramas, there are different types, and these types could be valued for different reasons. For example, comedy dramas might be valued for certain positive connotations (e.g., laughter), whereas a crime drama might be valued for certain negative connotations (e.g., fear). So, perhaps there is a difference between comedies (defined as comedy and animation) and tragedies (defined as crime, horror, and thriller). Granted, these definitions could be debated/refined, but they should provide a rough snapshot of the idea.

### Is there a difference in ratings between comedies and tragedies?

``` r
genre_split %>%
  mutate(
    com_trag = case_when(
      genres == "Comedy" |
        genres == "Animation" ~ "comedy",
      genres == "Crime" |
        genres == "Horror" |
        genres == "Thriller" ~ "tragedy"
    )
  ) %>%
  filter(!is.na(com_trag)) %>%
  group_by(com_trag) %>%
  top_ratings() %>%
  mutate(com_trag = str_to_title(com_trag)) %>%
  gt() %>%
  tab_header(title = "Mean/median differences between comedies and tragedies") %>%
  fmt_number(
    columns = vars(avg_rating, med_rating),
    decimals = 3
  ) %>%
  cols_label(
    com_trag = "Drama type",
    n = "Number of responses",
    avg_rating = "Average rating",
    med_rating = "Median rating"
  )
```

<div id="lclxihgkws" style="overflow-x:auto;overflow-y:auto;width:auto;height:auto;">
<style>html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', 'Fira Sans', 'Droid Sans', Arial, sans-serif;
}

#lclxihgkws .gt_table {
  display: table;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  color: #333333;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  background-color: #FFFFFF;
  width: auto;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #A8A8A8;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #A8A8A8;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
}

#lclxihgkws .gt_heading {
  background-color: #FFFFFF;
  text-align: center;
  border-bottom-color: #FFFFFF;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}

#lclxihgkws .gt_title {
  color: #333333;
  font-size: 125%;
  font-weight: initial;
  padding-top: 4px;
  padding-bottom: 4px;
  border-bottom-color: #FFFFFF;
  border-bottom-width: 0;
}

#lclxihgkws .gt_subtitle {
  color: #333333;
  font-size: 85%;
  font-weight: initial;
  padding-top: 0;
  padding-bottom: 6px;
  border-top-color: #FFFFFF;
  border-top-width: 0;
}

#lclxihgkws .gt_bottom_border {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}

#lclxihgkws .gt_col_headings {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}

#lclxihgkws .gt_col_heading {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 6px;
  padding-left: 5px;
  padding-right: 5px;
  overflow-x: hidden;
}

#lclxihgkws .gt_column_spanner_outer {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 4px;
  padding-right: 4px;
}

#lclxihgkws .gt_column_spanner_outer:first-child {
  padding-left: 0;
}

#lclxihgkws .gt_column_spanner_outer:last-child {
  padding-right: 0;
}

#lclxihgkws .gt_column_spanner {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 5px;
  overflow-x: hidden;
  display: inline-block;
  width: 100%;
}

#lclxihgkws .gt_group_heading {
  padding: 8px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
}

#lclxihgkws .gt_empty_group_heading {
  padding: 0.5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: middle;
}

#lclxihgkws .gt_from_md > :first-child {
  margin-top: 0;
}

#lclxihgkws .gt_from_md > :last-child {
  margin-bottom: 0;
}

#lclxihgkws .gt_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 10px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  overflow-x: hidden;
}

#lclxihgkws .gt_stub {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 12px;
}

#lclxihgkws .gt_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

#lclxihgkws .gt_first_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
}

#lclxihgkws .gt_grand_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

#lclxihgkws .gt_first_grand_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: double;
  border-top-width: 6px;
  border-top-color: #D3D3D3;
}

#lclxihgkws .gt_striped {
  background-color: rgba(128, 128, 128, 0.05);
}

#lclxihgkws .gt_table_body {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}

#lclxihgkws .gt_footnotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}

#lclxihgkws .gt_footnote {
  margin: 0px;
  font-size: 90%;
  padding: 4px;
}

#lclxihgkws .gt_sourcenotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}

#lclxihgkws .gt_sourcenote {
  font-size: 90%;
  padding: 4px;
}

#lclxihgkws .gt_left {
  text-align: left;
}

#lclxihgkws .gt_center {
  text-align: center;
}

#lclxihgkws .gt_right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

#lclxihgkws .gt_font_normal {
  font-weight: normal;
}

#lclxihgkws .gt_font_bold {
  font-weight: bold;
}

#lclxihgkws .gt_font_italic {
  font-style: italic;
}

#lclxihgkws .gt_super {
  font-size: 65%;
}

#lclxihgkws .gt_footnote_marks {
  font-style: italic;
  font-weight: normal;
  font-size: 65%;
}
</style>
<table class="gt_table">
  <thead class="gt_header">
    <tr>
      <th colspan="4" class="gt_heading gt_title gt_font_normal gt_bottom_border" style>Mean/median differences between comedies and tragedies</th>
    </tr>
    
  </thead>
  <thead class="gt_col_headings">
    <tr>
      <th class="gt_col_heading gt_columns_bottom_border gt_left" rowspan="1" colspan="1">Drama type</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Number of responses</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Average rating</th>
      <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1">Median rating</th>
    </tr>
  </thead>
  <tbody class="gt_table_body">
    <tr><td class="gt_row gt_left">Tragedy</td>
<td class="gt_row gt_right">1106</td>
<td class="gt_row gt_right">8.110</td>
<td class="gt_row gt_right">8.168</td></tr>
    <tr><td class="gt_row gt_left">Comedy</td>
<td class="gt_row gt_right">552</td>
<td class="gt_row gt_right">8.038</td>
<td class="gt_row gt_right">8.071</td></tr>
  </tbody>
  
  
</table>
</div>

So, there is a difference, people tend to rate tragedies higher than comedies, but in the grand scheme of things, this difference quite small. The average distance between comedies and tragedies is only 0.07, and the median difference is 0.1. Thus, it seems there’s not much difference in viewer ratings among sub-genres, at least not in our sample. But, this isn’t actually *that* surprising: Our sample was already narrowed down to TV *drama* titles. Since all of the titles share this common characteristic, what we’re probably seeing is the consistency of viewers to rate TV dramas in a similar fashion. In other words, people tend to rate all TV dramas similarly, regardless of the story line/sub-genre.

Since sub-genres didn’t bare much useful information, let’s take a look at the actual titles within the dataset. All of the top-rated shows aired for multiple seasons, but I doubt *every* show that aired multiple seasons was popular. In fact, some earlier analyses showed a decline in ratings over time. So, let’s see what the data say.

### How do viewer ratings changes over time by TV show title

``` r
# list most popular shows from earlier analysis (with extra picks of my own)
shows <- c("The X-Files", "Law & Order", "Midsomer Murders", "Law & Order: Special Victims Unit", "ER", "Grey's Anatomy", "CSI: Crime Scene Investigation", "Supernatural", "King of the Hill", "Doctor Who", "Criminal Minds", "Bones", "Murdoch Mysteries", "American Horror Story", "Are you Afraid of the Dark?", "Californication", "Elementary", "Lost", "Numb3rs", "Shameless", "The Walking Dead", "The Sopranos", "Scrubs", "Oz", "House", "Dexter")

tv_rating %>%
  filter(title %in% shows) %>%
  mutate(title = str_replace(title, "Special Victims Unit", "SVU")) %>%
  group_by(title) %>%
  ggplot() +
  aes(date, av_rating) +
  facet_wrap(~title) +
  geom_line() +
  labs(
    title = "Viewer ratings over time by TV show title",
    x = "Years aired",
    y = "Average rating"
  ) +
  theme_light() +
  theme(axis.text.x = element_text(angle = 90))
```

<img src="{{< blogdown/postref >}}index.en_files/figure-html/unnamed-chunk-8-1.png" width="672" />

Okay, now we have some interesting patterns to interpret. Overall, it looks like even the most popular shows experienced a decline in enthusiasm the longer they aired. However, there are notable exceptions to this trend: Criminal Minds and Murdoch Mysteries have really taken off in the last few years, both receiving the highest ratings out of any of the tiles in this sample. American Horror Story appears to be making a comeback as well recently. Noticeably, these exceptions all fit the suspenseful-like dramas noted earlier. It seems, then, the most successful TV dramas are ones with intense or striking elements (e.g., crime, murder, horror, etc.). I wonder if this says anything about the culture of the viewers…lookin’ at you America 🤔
