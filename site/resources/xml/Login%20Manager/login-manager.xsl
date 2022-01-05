<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    
	
	
	<!-- ROOT ELEMENT -->
	<xsl:template match="/sites">
		<html>
			<head>
				<title><xsl:value-of select="@name"/></title>
				<style type="text/css">
					@import url("login-manager.css");
				</style>
				<script type="text/javascript">
					function over(div, state){
						div.className = state === false ? 'site' : 'site over'
						}
				</script>
			</head>
			<body>
			<h1><xsl:value-of select="@name"/></h1>
				<xsl:apply-templates/>
			</body>
		</html>
	</xsl:template>
	
	

	<!-- DOMAINS -->
	<xsl:template match="category">
		<h2><xsl:value-of select="@name"/></h2>
		<div class="category">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	
	
	
	<!-- SITES -->
	<xsl:template match="site">
		
		<div class="site" onmouseover="over(this)" onmouseout="over(this, false)">
			<h3>
				<xsl:element name="a">
					<xsl:attribute name="href">
						<xsl:value-of select="@url"/>
					</xsl:attribute>
					<xsl:value-of select="@name"/>
				</xsl:element>
			</h3>
			<div class="controls">
				<xsl:if test="count(*)">
					<div class="title">Site : </div>
					<xsl:apply-templates/>
				</xsl:if>
			</div>
		</div>
	</xsl:template>



	<!-- APPLICATION -->
	<xsl:template match="application">
	    <div class="application">
			<div class="title">
				<xsl:element name="a">
					<xsl:choose>
						<xsl:when test="@url != ''">
							<xsl:attribute name="href">
								<xsl:value-of select="@url"/>
							</xsl:attribute>
						</xsl:when>
						<xsl:otherwise></xsl:otherwise>
					</xsl:choose>
					<xsl:value-of select="@name"/>
				</xsl:element> :

			</div>
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	


	<!-- FOLDER -->
	<xsl:template match="folder">
	
		<!-- form tag -->
		<xsl:element name="form">
			
			<!-- attributes -->
			<xsl:attribute name="method">get</xsl:attribute>
			<xsl:attribute name="action"><xsl:value-of select="substring-before(@url,'//')"/>//<xsl:value-of select="@username"/>:<xsl:value-of select="@password"/>@<xsl:value-of select="substring-after(@url,'//')"/></xsl:attribute>
			
			<!-- submit button -->
			<xsl:element name="input">
				<xsl:attribute name="type">submit</xsl:attribute>
				<xsl:attribute name="value">
					<xsl:choose>
						<xsl:when test="@name != ''"><xsl:value-of select="@name"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="name(.)"/></xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:attribute name="title">Folder -  
					<xsl:value-of select="concat('username: ', @username, ' | password: ', @password)"/>
				</xsl:attribute>
			</xsl:element>
			
		</xsl:element>
	
	</xsl:template>



	<!-- PAGE -->
	<xsl:template match="page">
	
		<!-- form tag -->
		<xsl:element name="form">
			
			<!-- attributes -->
			<xsl:attribute name="method">get</xsl:attribute>
			<xsl:attribute name="action"><xsl:value-of select="@url"/></xsl:attribute>
			
			<!-- submit button -->
			<xsl:element name="input">
				<xsl:attribute name="type">submit</xsl:attribute>
				<xsl:attribute name="value">
					<xsl:choose>
						<xsl:when test="@name != ''"><xsl:value-of select="@name"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="name(.)"/></xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:attribute name="title">Page</xsl:attribute>
			</xsl:element>
			
		</xsl:element>
	
	</xsl:template>



	<!-- LOGIN OR DATABASE TAGS -->
	<xsl:template match="login|database">
	
		<!-- form tag -->

		<xsl:element name="form">
		
			<!-- attributes -->
			<xsl:attribute name="action"><xsl:value-of select="@url"/></xsl:attribute>
			<xsl:attribute name="method">post</xsl:attribute>
			<!-- <xsl:attribute name="target">_blank</xsl:attribute> -->
			
			
			<!-- loop through all attributes and create controls -->
			<xsl:for-each select="@*">
			
				<!-- create hidden fields for all attributes except url, which is used in the form-->
				<xsl:if test="name(.) != 'url'">
					<xsl:element name="input">
					
						<xsl:attribute name="type">hidden</xsl:attribute>

						<xsl:attribute name="name">
						
							<!-- 
							SPECIAL CASES
							==================================================================================
							
							You may want to store all your username and passwords in the XML file
							as username="" and password="", but the forms you submit may expect 
							differenly-named variables, for example, Wordpress expects log and pwd.
							
							Luckily with XSL you can apply some logic to the document as it's processed!
							
							This is the place to put in place application-specific checks, so the 
							output (HTML) is amended according to the input(XML).
							
							For example, if the application tag has the name attribute set to "Wordpress",
							we simply change the name of the form fields to log and pwd, but still output 
							the correct username and password values.
							
							==================================================================================
							-->

							<xsl:choose>
							
								<!-- PHPMYADMIN - check @client attribute for "phpmyadmin" -->
								<!--<xsl:when test="@client = 'phpmyadmin'">pma_<xsl:value-of select="name(.)"/></xsl:when>-->

								<!-- DATABASE - default to phpmyadmin by updating the variables -->
								<xsl:when test="name(..) = 'database'">pma_<xsl:value-of select="name(.)"/></xsl:when>

								<!-- WORDPRESS - check @name attribute for "Wordpress" -->
								<xsl:when test="../../@name = 'Wordpress'">
									<xsl:choose>
										<xsl:when test="name(.) = 'username'">log</xsl:when>
										<xsl:when test="name(.) = 'password'">pwd</xsl:when>
									</xsl:choose>
								</xsl:when>

								<!-- OTHERWISE - just output the values as they are stored -->
								<xsl:otherwise><xsl:value-of select="name(.)"/></xsl:otherwise>
								
							</xsl:choose>

						</xsl:attribute>
						
						<xsl:attribute name="value">
							<xsl:value-of select="."/>
						</xsl:attribute>

					</xsl:element>
				</xsl:if>

			</xsl:for-each>
		
			<!-- submit button -->
			<xsl:element name="input">
				<xsl:attribute name="type">submit</xsl:attribute>
				<xsl:attribute name="value">
					<xsl:choose>
						<xsl:when test="@name != ''"><xsl:value-of select="@name"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="name(.)"/></xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:attribute name="title">Login - 
					<xsl:value-of select="concat('username: ', @username, ' | password: ', @password)"/>
				</xsl:attribute>
			</xsl:element>
			
		</xsl:element>
	
	</xsl:template>




</xsl:stylesheet>
