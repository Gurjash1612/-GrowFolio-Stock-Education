<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>GrowFolio XML Sitemap</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0a0a0a;
            color: #f4f4f5;
            margin: 0;
            padding: 24px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: #18181b;
            border: 1px border #27272a;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          }
          h1 {
            font-size: 24px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 8px;
            color: #10b981;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          p {
            color: #a1a1aa;
            font-size: 14px;
            margin-bottom: 24px;
            line-height: 1.5;
          }
          p a {
            color: #10b981;
            text-decoration: none;
          }
          p a:hover {
            text-decoration: underline;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13px;
          }
          th {
            background-color: #27272a;
            color: #e4e4e7;
            padding: 12px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
          }
          th:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          th:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          tr:not(:last-child) td {
            border-bottom: 1px solid #27272a;
          }
          td {
            padding: 12px;
            color: #d4d4d8;
            word-break: break-all;
          }
          td a {
            color: #34d399;
            text-decoration: none;
            font-weight: 500;
          }
          td a:hover {
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            background-color: #27272a;
            color: #a1a1aa;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>GrowFolio XML Sitemap</h1>
          <p>
            This is an XML Sitemap generated for search engines (like Google, Bing, and Yahoo) to crawl and index pages. 
            For more details, visit <a href="https://gurjash1612.github.io/-GrowFolio-Stock-Education/">GrowFolio</a>.
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Freq</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td>
                    <a href="{s:loc}">
                      <xsl:value-of select="s:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="badge">
                      <xsl:value-of select="s:lastmod"/>
                    </span>
                  </td>
                  <td>
                    <xsl:value-of select="s:changefreq"/>
                  </td>
                  <td>
                    <span class="badge" style="background-color: rgba(16, 185, 129, 0.15); color: #34d399;">
                      <xsl:value-of select="s:priority"/>
                    </span>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
