<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | TypingBull</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            color: #334155;
            background-color: #f8fafc;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid #e2e8f0;
          }
          h1 {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 0;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          p.desc {
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0284c7;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            margin-bottom: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-align: left;
            padding: 12px 14px;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #f1f5f9;
            word-break: break-all;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority {
            font-weight: 700;
            color: #059669;
          }
          .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🐂 TypingBull XML Sitemap</h1>
          <p class="desc">
            This XML Sitemap provides search engines like Google and Bing with indexable URLs for <strong>TypingBull</strong>.
            Learn more at <a href="https://typingbull.com/">typingbull.com</a>.
          </p>
          <div class="badge">
            Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 60%;">URL Location</th>
                <th style="width: 20%;">Change Frequency</th>
                <th style="width: 20%;">Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td class="priority">
                    <xsl:value-of select="sitemap:priority"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            Generated for <a href="https://typingbull.com">TypingBull</a> • Free Gamified Touch Typing Platform
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
