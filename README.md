Amilia Demo Organization
========================

This demo site demonstrates how easy it is to embed your Amilia Page inside your organization's web site. Your clients can then consult your catalog of activities without leaving you site. Embedding is done using an iframe.

Example
-------
We have created a sample site. Checkout the Amilia Demo Organization: http://ziliko.github.io/amilia-demo-organization/.

Instructions
------------
1.  Copy this code in your HTML document.
```
<!-- Embed this code in your page. Ensure to change src to your store. -->
<div id="amilia">
	<iframe id="amilia-iframe"
			allowtransparency="true"
			frameborder="0"
			width="100%"
			style="width: 100%!important; border: none!important; overflow: hidden!important;"
			scrolling="no"
			horizontalscrolling="no"
			verticalscrolling="no"
			src="AMILIA-PAGE-URL
	</iframe>
	<script src="http://www.amilia.com/scripts/amilia-iframe.js" type="text/javascript"></script>
</div>
<!-- End of Amilia embed -->
```
Ensure to change AMILIA-PAGE-URL with the URL of your Amilia Page.

2.  Host this file on your web site: 
http://ziliko.github.io/amilia-demo-organization/amilia-iframe-helper.html
It must be located at the root of your domain. For example:
```
http://www.example.com/amilia-iframe-helper.html
```
This file is necessary to allow communication between your page and the Amilia iframed page. It allows Amilia to resize the iframe.

FAQ
---
Q.  Why should I embed my Amilia Page on my web site? <br/>
A.  By embedding your Amilia Page on your web site, your customers can remain on your site to navigate through your catalog of events. Search engines will also index the content making it easier for people to discover what you offer.

Q.  Why do I need to host amilia-iframe-helper.html on my site? <br/>
A.  Because of the same-origin policy, the Amilia Page embedded in the iframe cannot talk with your Organization page. To overcome this limitation, we are able to communicate through the HTML page you host on your site. For a more technical description, please consult this article: http://stackoverflow.com/questions/153152/resizing-an-iframe-based-on-content

Q.  A part of the Amilia Page is being cut off. I cannot see all of my page. <br/>
A.  Ensure the amilia-iframe-helper.html is located in the root of your domain. For example: www.example.com/amilia-iframe-helper.html

Reporting issues
----------------
For help on implementation, please go to http://support.amilia.com.