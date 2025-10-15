<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" />
  
  <xsl:template match="/">
    <html>
      <head>
        <title>Employee List</title>
      </head>
      <body>
        <h1>Employee List</h1>
        <table border="1">
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
          </tr>
          <xsl:for-each select="employees/employee">
            <tr>
              <td><xsl:value-of select="name"/></td>
              <td><xsl:value-of select="position"/></td>
              <td><xsl:value-of select="department"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
