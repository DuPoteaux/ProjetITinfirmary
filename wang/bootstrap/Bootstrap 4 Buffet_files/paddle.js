// Get Script Load Location
window.PaddleScriptLocation = null;
try {
	var loadedScripts = document.getElementsByTagName("script");
	window.PaddleScriptLocation = (document.currentScript || loadedScripts[loadedScripts.length - 1]).src;
	window.PaddleScriptLocation = window.PaddleScriptLocation.split('?')[0];
} catch(ignore) { }

// Begin Paddle.js Library
var _Paddle = (function Paddle(_window, libraryVersion) {
	
	return function PaddleConstruct(_window, libraryVersion) {
		// Cache 'this' for scoping.
		var _this = this;
		
		// Default options that can be overridden with the Options() methods.
		var _options = {
			debug: false,
			enableTracking: true,
			poweredByBadge: true,
			loadMethod: 'Direct', // Direct or Migrate
			vendor: null, // Needs to be overridden for Pageview tracking to work.
			eventCallback: null, // Global event handler/callback
			sdk: false,
			sdkAttributes: null,
			completeDetails: false, // Automatic checkout complete popup.
			checkoutVariant: null, // Forces a particular checkout variant and removes from A/B test group.
			upsellCheckbox: false
		};
		
		// Internal storage of product prices.
		var _prices = {};
		
		// The currently active checkout.
		var _activeCheckout = {};
		
		// Available checkout variants, and their ratios.
		var _checkoutVariants = [
			{
				control: true,
				variant: 'multipage',
				weight: 1
			},
			{
				control: false,
				variant: 'multipage-compact-payment',
				weight: 1
			},
			{
				control: false,
				variant: 'multipage-radio-payment',
				weight: 1
			},
			{
				control: false,
				variant: 'multipage-radio-payment-selected',
				weight: 1
			}
		];
		
		// Environment Defaults
		var _env = {
			current: 'production',
			defaults: {
				local: {
					checkoutBase: 'https://checkout.paddle.local:8443/checkout/product/',
					internalCheckoutBase: 'https://checkout.paddle.local:8443/checkout/tool/',
					pricesApi: 'https://checkout.paddle.local:8443/api/1.0/prices',
					dataApi: 'https://checkout.paddle.local:8443/api/1.0/data',
					orderApi: 'https://checkout.paddle.local:8443/api/1.0/order',
					audienceApi: 'https://checkout.paddle.local:8443/api/1.0/audience/{vendor_id}/add',
					conversationCreateApi: 'https://vendors.paddle.com:8443/conversation/api/create',
					userHistoryApi: 'https://checkout.paddle.com:8443/api/2.0/user/history',
					analyticsKey: '8b03159305e2c0f49bf7481c073a4819',
					affiliateAnalyticsKey: '8be7b8d69526697e7ae22aff30d34603'
				},
				dev: {
					checkoutBase: 'https://dev-checkout.paddle.com/checkout/product/',
					internalCheckoutBase: 'https://dev-checkout.paddle.com/checkout/tool/',
					pricesApi: 'https://dev-checkout.paddle.com/api/1.0/prices',
					dataApi: 'https://dev-checkout.paddle.com/api/1.0/data',
					orderApi: 'https://dev-checkout.paddle.com/api/1.0/order',
					audienceApi: 'https://dev-checkout.paddle.com/api/1.0/audience/{vendor_id}/add',
					conversationCreateApi: 'https://dev-vendors.paddle.com/conversation/api/create',
					userHistoryApi: 'https://dev-checkout.paddle.com/api/2.0/user/history',
					analyticsKey: '8b03159305e2c0f49bf7481c073a4819',
					affiliateAnalyticsKey: '8be7b8d69526697e7ae22aff30d34603'
				},
				staging: {
					checkoutBase: 'https://staging-checkout.paddle.com/checkout/product/',
					internalCheckoutBase: 'https://staging-checkout.paddle.com/checkout/tool/',
					pricesApi: 'https://staging-checkout.paddle.com/api/1.0/prices',
					dataApi: 'https://staging-checkout.paddle.com/api/1.0/data',
					orderApi: 'https://staging-checkout.paddle.com/api/1.0/order',
					audienceApi: 'https://staging-checkout.paddle.com/api/1.0/audience/{vendor_id}/add',
					conversationCreateApi: 'https://staging-vendors.paddle.com/conversation/api/create',
					userHistoryApi: 'https://staging-checkout.paddle.com/api/2.0/user/history',
					analyticsKey: '8b03159305e2c0f49bf7481c073a4819',
					affiliateAnalyticsKey: '8be7b8d69526697e7ae22aff30d34603'
				},
				production: {
					checkoutBase: 'https://checkout.paddle.com/checkout/product/',
					internalCheckoutBase: 'https://checkout.paddle.com/checkout/tool/',
					pricesApi: 'https://checkout.paddle.com/api/1.0/prices',
					dataApi: 'https://checkout.paddle.com/api/1.0/data',
					orderApi: 'https://checkout.paddle.com/api/1.0/order',
					audienceApi: 'https://checkout.paddle.com/api/1.0/audience/{vendor_id}/add',
					conversationCreateApi: 'https://vendors.paddle.com/conversation/api/create',
					userHistoryApi: 'https://checkout.paddle.com/api/2.0/user/history',
					analyticsKey: '3cca81641d7d36dd0223d8a5615ae36a',
					affiliateAnalyticsKey: '05150e015258048ddbc1aa7188718750'
				}
			}
		};
		
		// API keys, URLs and default values used throughout.
		var _defaults = {
			includeBrowserInCampaignSummary: false,
			analyticsCookie: 'paddlejs_checkout',
			affiliateAnalyticsCookie: 'paddlejs_affiliate_analytics',
			devmateCookie: '_dmsid',
			popupCookie: 'paddlejs_popup',
			campaignCookiePrefix: 'paddlejs_campaign_', // affiliate uses this (eg. 'paddlejs_campaign_affiliate')
			campaignCookieExpiresDays: 30,
			checkoutVariantCookie: 'paddlejs_checkout_variant',
			checkoutVariantCookieExpiresDays: 90,
			paddleCssFile: 'https://cdn.paddle.com/paddle/assets/css/paddle.css',
			animationCssFile: 'https://cdn.paddle.com/paddle/assets/css/animate.css',
			popupWindow: {
				width: 370,
				height: 470,
				location: 'yes',
				menubar: 'no',
				resizable: 'yes',
				scrollbars: 'yes',
				status: 'no',
				toolbar: 'no'
			},
			domainCategories: {
				'paddle.com': {
					name: 'Paddle',
					type: 'Marketplace'
				},
				'creatable': {
					name: 'Creatable',
					type: 'Marketplace'
				},
				'facebook.com': {
					name: 'Facebook',
					type: 'Social'
				},
				'fb.com': {
					name: 'Facebook',
					type: 'Social'
				},
				't.co': {
					name: 'Twitter',
					type: 'Social'
				},
				'twitter.com': {
					name: 'Twitter',
					type: 'Social'
				},
				'reddit.com': {
					name: 'Reddit',
					type: 'Social'
				},
				'medium.com': {
					name: 'Medium',
					type: 'Social'
				},
				'news.ycombinator.com': {
					name: 'Hacker News',
					type: 'Social'
				},
				'designernews.com': {
					name: 'Designer News',
					type: 'Social'
				},
				'producthunt.com': {
					name: 'Product Hunt',
					type: 'Social'
				},
				'paypal.com': {
					name: 'Paddle',
					type: 'Marketplace'
				},
				'my.paddle.com': {
					name: 'Paddle',
					type: 'Marketplace'
				},
				'cultofmac.com': {
					name: 'Cult of Mac',
					type: 'Article'
				},
				'mail.yahoo': {
					name: 'Yahoo Mail',
					type: 'Email'
				},
				'mail.google': {
					name: 'Gmail',
					type: 'Email'
				},
				'gmail': {
					name: 'Gmail',
					type: 'Email'
				},
				'mail.google.com': {
					name: 'Gmail',
					type: 'Email'
				},
				'mail.live': {
					name: 'Live Mail',
					type: 'Email'
				},
				'mail.aol.com': {
					name: 'Aol Mail',
					type: 'Email'
				},
				'mail.qq.com': {
					name: 'QQ Mail',
					type: 'Email'
				},
				'mail.comcast.net': {
					name: 'Comcast Mail',
					type: 'Email'
				},
				'earthlink.net': {
					name: 'Earthlink Mail',
					type: 'Email'
				},
				'bing': {
					name: 'Bing',
					type: 'Search'
				},
				'yahoo': {
					name: 'Yahoo',
					type: 'Search'
				},
				'google': {
					name: 'Google',
					type: 'Search'
				},
				'localhost': {
					name: 'Localhost',
					type: 'Local'
				}
			}
		};
		
		// Internal storage of object states needed globally.
		var _status = {};
		
		// Environments
		this.Environment = {
			
			detect: function() {
				if(typeof _util.urlParam('paddle_env') != 'undefined' && _util.urlParam('paddle_env') != '') {
					_this.Debug('Environment Detected: '+_util.urlParam('paddle_env'));
					this.set(_util.urlParam('paddle_env'));
				} else {
					_this.Debug('Environment Detected: '+this.get());
				}
			},
			
			get: function() {
				return _env.current;
			},
			
			set: function(environment) {
				_this.Debug('Changing environment to: '+environment);
				_env.current = environment;
			},
			
			defaults: function() {
				return _env.defaults[_env.current];
			}
			
		};
		
		// Global internal statuses
		this.Status = {
			loadedAnalytics: false,
			loadedAffiliateAnalytics: false,
			failedLoadingAnalytics: false,
			failedLoadingAffiliateAnalytics: false,
			loadedButtonStylesheet: false,
			loadedAnimationStylesheet: false,
			libraryVersion: libraryVersion
		};
		
		// Method for overwriting values in _options
		this.Options = function(options) {
			if(typeof options == 'object') {
				// Loop through the 'options' object that is passed to this function.
				for(var option in options) {
					// Check that we're not looping throw Prototype methods.
					if(options.hasOwnProperty(option)) {
						// Check that the option they're trying to override is one we support overriding.
						if(_options.hasOwnProperty(option)) {
							// Validate the 'vendor' option if set.
							if(option == 'vendor') {
								if(options[option] !== parseInt(options[option], 10)) {
									throw new Error("[PADDLE] The option parameter 'vendor' must be an integer.");
								}
								
								// The ID 1234567 is reserved for examples, if someone uses this, throw an error.
								if(options[option] == 1234567) {
									throw new Error("[PADDLE] You must specify a valid Paddle Vendor ID as the 'vendor' attribute of passed to Paddle.Setup() or Paddle.Options(). The provided Vendor ID '1234567' is invalid and used for example purposes. You can get your Paddle Vendor ID from the 'Integrations' tab of the following page: https://vendors.paddle.com/account");
								}
							} else if(option == 'sdkAttributes') {
								_options.sdkAttributes = options.sdkAttributes;
							}
							
							// Overwrite the options object with the new defined values.
							_this.Debug("Set option '"+option+"' to '"+options[option]+"'.");
							
							if(option != 'sdkAttributes') {
								_options[option] = options[option];
							}
						} else {
							// If it's not an option we support overriding, throw an error.
							throw new Error("[PADDLE] Unknown option parameter '"+option+"'");
						}
					}
				}
			} else {
				throw new Error("[PADDLE] The Options() method accepts an object of options values.");
			}
		};
		
		// Setup is called once per session, here we do anything global, like setting listeners...
		this.Setup = function(options) {
			if(!window.PaddleCompletedSetup) {
				// If an 'options' object is passed to Setup, then use it.
				if(typeof options != 'undefined' && typeof options == 'object') {
					if(typeof options.vendor != 'undefined') {
						_this.Options(options);
					} else {
						throw new Error("[PADDLE] You must specify your Paddle Vendor ID during within the Paddle.Setup(); method. See 'Basic Setup' in the Paddle.js documentation: https://www.paddle.com/docs/paddle-js-overlay-checkout");
					}
				}
								
				// Determine Checkout Variant
				if(!_options.checkoutVariant) {
					if(_util.getCookie(_defaults.checkoutVariantCookie) && _util.getCookie(_defaults.checkoutVariantCookie) != '') {
						_options.checkoutVariant = JSON.parse(_util.getCookie(_defaults.checkoutVariantCookie));
					} else {
						var variantData = _util.chooseCheckoutVariant();
						_options.checkoutVariant = {
							inTest: true,
							controlGroup: variantData.control,
							variant: variantData.variant
						};
						
						_util.setCookie(_defaults.checkoutVariantCookie, JSON.stringify(_options.checkoutVariant), _defaults.checkoutVariantCookieExpiresDays);
					}
				} else {
					_options.checkoutVariant = {
						inTest: false,
						controlGroup: false,
						variant: _options.checkoutVariant || 'multipage'
					};
				}
				
				 // Fire an analytics event to track the library has loaded.
				 _this.Analytics.track('Paddle.Library.Loaded', {
					 'Script.Location': window.PaddleScriptLocation || null
				 }, {});
			
				 // Track Affiliate visits.
				 _this.Affiliate.Event('Visit');
			
				 // Track the pageview if the vendor has set their ID.
				 _this.Analytics.trackPageview();
				 
				 // Load buttons & animations stylesheets.
				 _this.Animation.addStylesheet();
				 _this.Button.addStylesheet();
				 
				 // Check mobile session...
				 if(_util.isMobile()) {
					 _this.Debug('Mobile session detected.');
				 }
			
				 // Here we would look for 'paddle_button' items, and call a function to iterate
				 // over them, like this.Paddle.Button.load(); ('this' is required due to our current scope)
				 _this.Button.load();
				 
				 // Here we look for 'paddle_download' items, and invoke them.
				  _this.Download.load();
			
				 // Mark the library as having completed setup, so we don't run this block more than once
				 // even if there are multipe <script>'s with Paddle.js on the page.
				 window.PaddleCompletedSetup = true;
			
				 // Fire a 'completed setup' debug event, just for verbosity.
				 _this.Debug('Completed library setup.');
				
				// Start listeners.
				_util.listen();
				
				// Detect/set checkout environment.
				_this.Environment.detect();
				
				// Detect and store campaign attributes (and affiliates)
				_util.campaignAttributes();
				
				// Detect any auto-apply/auto-open URL parameters.
				_util.detectAutoOpen();
			} else {
				_this.Debug('Cannot call Paddle.Setup() more than once per page, the call was ignored.', 'warning');
			}
		};
		
		// User methods (history).
		this.User = {
			
			History: function(email, product_id, callback) {
				var product_id = typeof product_id == 'undefined' ? null : product_id;
				
				if(email != '') {
					_this.Analytics.track('Paddle.User.History', {}, {
						'ProductID': product_id || null
					});
					
					var productFilter = '';
					if(product_id) {
						productFilter = '&product_id='+product_id;
					}
					
					_util.jsonp(_this.Environment.defaults().userHistoryApi+'?email='+encodeURIComponent(email)+'&vendor_id='+_options.vendor+productFilter, function(data) {
						if(typeof callback == 'function') {
							callback(data);
						} else {
							alert(data.message);
						}
					});
				} else {
					if(typeof callback == 'function') {
						callback({
							"success": false,
							"error": {
								"code": 107,
								"message": "A valid email address is required, please try again"
							}
						});
					} else {
						alert('You must enter a valid email address.');
					}
				}
			}
			
		};
		
		// Product methods (primarily dealing with prices)
		this.Product = {
			
			// Gets a money attribute (total, unit price, tax etc...) for a product.
			Price: function(amountType, productId, quantity, callback) {
				_this.Analytics.track('Paddle.Prices.SinglePrice', {}, {
					'ProductID': productId,
					'AmountType': amountType
				});
				
				if(typeof quantity == 'undefined') {
					var quantity = 1;
				} else if(quantity <= 0) {
					var quantity = 1;
				}
				
				var priceData = _util.getPrices(productId, quantity, function(priceData) {
					if(typeof callback != 'undefined') {						
						if(typeof priceData.price != 'undefined') {
							if(amountType == 'gross') {
								callback(priceData.price.gross || false);
							} else if(amountType == 'tax') {
								callback(priceData.price.tax || false);
							} else if(amountType == 'net') {
								callback(priceData.price.net || false);
							} else if(amountType == 'tax_included') {
								callback(priceData.price.tax_included || false);
							} else {
								callback(false);
							}
						} else {
							callback(false);
						}
					}
				});
			},
			
			// Gets all money attributes for a product
			Prices: function(productId, quantity, callback) {
				_this.Analytics.track('Paddle.Prices.MultiPrice', {}, {
					'ProductID': productId
				});
				
				// The 'quantity' parameter was added later in the scope of this function. The checking here
				// allows for a user to specify (productId, callback) - in which case we treat quanity as 1, or
				// allows them to specify (productId, quanity, callback) - in which case it respects the quantity
				// parameter's value.
				if(typeof quantity == 'function') {
					var callback = quantity;
					var quantity = 1;
				}
				
				var priceData = _util.getPrices(productId, quantity, function(priceData) {
					if(typeof callback != 'undefined' && typeof callback == 'function') {						
						callback(priceData);
					}
				});
			}
			
		};
		
		// Post-checkout Order Methods.
		this.Order = {
			
			_pollAttempts: [],
			_maxPollAttempts: 10,
			_polling: [],
			
			DetailsPopup: function(checkoutHash, processingMessage) {
				var popupInstance = '_'+Math.ceil(Math.random()*10000000);
				var processingMessage = typeof processingMessage != 'undefined' ? processingMessage : 'Fetching Order Details...';
				
				var popupHtml = '<div class="paddle-popup paddle-animated paddle-bounceIn">';

					popupHtml += '<div class="paddle-popup-close paddle-inset-close">';
						popupHtml += '<a class="paddle-popup-close-image" href="javascript:;"><img src="https://cdn.paddle.com/paddle/assets/images/close-dark.png" border="0" /></a>';
					popupHtml += '</div>';
				
					popupHtml += '<div class="paddle-popup-inner paddle-no-padding" style="background-color: #FFFFFF !important;">';
						popupHtml += '<div class="paddle-popup-order-loading paddle-popup-order-loading_'+popupInstance+'">';
							popupHtml += '<div class="paddle-popup-order-spinner"><img src="https://cdn.paddle.com/paddle/assets/images/loading.gif" style="width: 50px; height: 50px;" /></div>';
							popupHtml += '<div class="paddle-popup-order-loading-text paddle-order-loading-text_'+popupInstance+'">'+processingMessage+'</div>';
						popupHtml += '</div>';
						
						popupHtml += '<div class="paddle-popup-order-error paddle-popup-order-error_'+popupInstance+' paddle-fadeInDown paddle-hidden">';
							popupHtml += 'Your receipt and purchase information have been sent to the email address used during purchase.';
						popupHtml += '</div>';
						
						popupHtml += '<div class="paddle-popup-order paddle-popup-order_'+popupInstance+' paddle-fadeInDown paddle-hidden">';
							popupHtml += 'Order details go here...';				
						popupHtml += '</div>';
					popupHtml += '</div>';
				
				popupHtml += '</div>';
				
				_util.ready(function() {
					var body = document.getElementsByTagName('body')[0];
					var orderPopup = document.createElement('div');
					orderPopup.setAttribute('class', 'paddle-reset paddle-popup-container paddle-popup-instance_'+popupInstance+' paddle-animated paddle-fadeIn paddle-hidden');
					orderPopup.innerHTML = popupHtml;
					body.appendChild(orderPopup);
					
					var close = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-close-image')[0];
					close.onclick = function(e) {
						e.preventDefault();
						_this.Popup.hide(popupInstance, 'order');
					};
					
					_this.Popup.show(popupInstance, 'Order', 'order');
					
					_this.Order.details(checkoutHash, function(data) {
						if(data) {
							if(data.state == 'processed') {								
								var popupContent = '<div class="paddle-popup-order-details">';
								
									popupContent += '<div class="paddle-popup-order-top">';
										popupContent += '<div class="paddle-popup-order-icon">';
											popupContent += '<img src="'+data.checkout.image_url+'" border="0" />';
										popupContent += '</div>';
									
										popupContent += '<div class="paddle-popup-order-product">';
											popupContent += data.checkout.title;
										popupContent += '</div>';
									
										popupContent += '<div style="clear:both;"></div>';
									popupContent += '</div>';
									
									popupContent += '<div class="paddle-popup-order-summary">';
										popupContent += '<div class="paddle-popup-order-number">';
											popupContent += 'Order #'+data.order.order_id;
										popupContent += '</div>';
										
										popupContent += '<div class="paddle-popup-order-amount">';
											popupContent += data.order.formatted_total;
										popupContent += '</div>';
										
										popupContent += '<div class="paddle-popup-order-receipt">';
											popupContent += '<a href="'+data.order.receipt_url+'" target="_blank" class="paddle-popup-order-receipt-button paddle-popup-order-receipt-button_'+popupInstance+'">View Receipt</a>';
										popupContent += '</div>';
										
										popupContent += '<div style="clear:both;"></div>';
									popupContent += '</div>';
									
									if(data.order.has_locker) {
										popupContent += '<div class="paddle-popup-order-locker">';
											
											// @note Currently, it isn't a nice UX to display multi-product order lockers in the popup.
											// @todo Add product name per-locker to the API, and change this UI to work with multi-product orders.
											if(data.lockers.length > 1) {
												popupContent += '<div class="paddle-popup-order-nolocker">';
												popupContent += "<strong>Thanks for your purchase!</strong><br /><br />";
												popupContent += "We've emailed your receipt and details of how to access your products to <strong>"+data.order.customer.email+"</strong>.";
												popupContent += '</div>';
											} else {
												// @note The forEach here isn't neccecary, but it's cumbersome to remove.
												data.lockers.forEach(function(locker) {
													popupContent += '<div class="paddle-popup-locker-item">';
														
														if(typeof locker.download != 'undefined' && locker.download != '') {
															popupContent += '<div class="paddle-popup-locker-row-button">';
																popupContent += '<a href="'+locker.download+'" target="_blank" class="paddle-popup-locker-row-button-link paddle-popup-order-download-button_'+popupInstance+'">Download</a>';
															popupContent += '</div>';
														}
														
														if(typeof locker.license_code != 'undefined' && locker.license_code != '') {
															popupContent += '<div class="paddle-popup-locker-row">';
																popupContent += '<div class="paddle-popup-locker-row-top">';
																	popupContent += '<div class="paddle-popup-locker-row-heading">License Code</div>';
																	popupContent += '<div style="clear:both;"></div>';
																popupContent += '</div>';
																popupContent += '<div class="paddle-popup-locker-license">';
																	popupContent += '<pre class="paddle-popup-pre">'+locker.license_code+'</pre>';
																popupContent += '</div>';
															popupContent += '</div>';
														}
														
														if(typeof locker.instructions != 'undefined' && locker.instructions != '') {
															// Instructions HTML is often too escaped.
															locker.instructions = locker.instructions.replace(/\\"/g, '"').trim();
															
															popupContent += '<div class="paddle-popup-locker-row">';
																popupContent += '<div class="paddle-popup-locker-row-top">';
																	popupContent += '<div class="paddle-popup-locker-row-heading">Instructions &amp; Information</div>';
																	popupContent += '<div style="clear:both;"></div>';
																popupContent += '</div>';
																popupContent += '<div class="paddle-popup-locker-instructions">';
																	popupContent += _util.nl2br(locker.instructions);
																popupContent += '</div>';
															popupContent += '</div>';
														}
														
													popupContent += '</div>';
												});
											}
											
										popupContent += '</div>';
									} else {
										popupContent += '<div class="paddle-popup-order-nolocker">';
											popupContent += "We've emailed details of how to access your purchases, as well as the information above to <strong>"+data.order.customer.email+"</strong>.";
										popupContent += '</div>';
									}
									
									popupContent += '<div class="paddle-popup-order-problem">';
										popupContent += 'Something wrong? <a href="mailto:help+pjs_'+data.order.order_id+'_'+checkoutHash+'_order@paddle.com" class="paddle-popup-order-problem-link paddle-popup-order-problem-link_'+popupInstance+'">Contact Support</a>';
										popupContent += '<div class="paddle-popup-order-emailed-reminder">We\'ve also emailed the above information to: <strong>'+data.order.customer.email+'</strong></div>';
									popupContent += '</div>';
								
								var orderPopupContent = document.getElementsByClassName('paddle-popup-order_'+popupInstance)[0];
								orderPopupContent.innerHTML = popupContent;
								
								_util.hide(document.getElementsByClassName('paddle-popup-order-loading_'+popupInstance)[0]);
								
								// Add analytics events to buttons/links within the popup.
								if(typeof document.getElementsByClassName('paddle-popup-order-problem-link_'+popupInstance)[0] != 'undefined') {
									document.getElementsByClassName('paddle-popup-order-problem-link_'+popupInstance)[0].onclick = function(e) {
										_this.Analytics.track('Paddle.Order.Details.Contact', {}, {});
									};
								}
								
								if(typeof document.getElementsByClassName('paddle-popup-order-download-button_'+popupInstance)[0] != 'undefined') {
									document.getElementsByClassName('paddle-popup-order-download-button_'+popupInstance)[0].onclick = function(e) {
										_this.Analytics.track('Paddle.Download.Start', {}, {
											'ViaOrderDetails': true
										});
									};
								}
								
								if(typeof document.getElementsByClassName('paddle-popup-order-receipt-button_'+popupInstance)[0] != 'undefined') {
									document.getElementsByClassName('paddle-popup-order-receipt-button_'+popupInstance)[0].onclick = function(e) {
										_this.Analytics.track('Paddle.Order.Details.Receipt', {}, {});
									};
								}
								
								_util.show(orderPopupContent);
							} else {
								_util.hide(document.getElementsByClassName('paddle-popup-order-loading_'+popupInstance)[0]);
								_util.show(document.getElementsByClassName('paddle-popup-order-error_'+popupInstance)[0]);
							}
						} else {
							_util.hide(document.getElementsByClassName('paddle-popup-order-loading_'+popupInstance)[0]);
							_util.show(document.getElementsByClassName('paddle-popup-order-error_'+popupInstance)[0]);
						}
					}, false);
				});
			},
			
			details: function(checkoutHash, callback, showLoader) {
				_this.Order._polling[checkoutHash] = typeof _this.Order._polling[checkoutHash] != 'undefined' ? _this.Order._polling[checkoutHash] : false;
				
				if(!_this.Order._polling[checkoutHash]) {
					_this.Analytics.track('Paddle.Order.Details', {}, {
						'CheckoutID': checkoutHash
					});
					
					if(typeof showLoader == 'undefined') {
						var showLoader = true;
					}
					
					if(showLoader) {
						_this.Spinner.show();
					}
					
					_this.Order.poll(checkoutHash, function(data) {
						if(showLoader) {
							_this.Spinner.hide();
						}
						
						if(typeof callback == 'function') {
							_this.Debug('Order details API response successfully passed to callback: '+callback);
							callback(data);
						} else {
							_this.Debug('No callback specified for Order Data success.', 'warning', true);
						}
					});
				} else {
					_this.Debug('Call to Order.details() rejected as a call is already in progress.', 'error', true);
				}
			},
			
			poll: function(checkoutHash, callback) {
				if(_this.Order._polling[checkoutHash] !== true) {
					_this.Analytics.track('Paddle.Order.Details.Poll.Start', {}, {
						'CheckoutID': checkoutHash
					});
				}
				
				_this.Order._polling[checkoutHash] = true;
				
				_util.jsonp(_this.Environment.defaults().orderApi+'?checkout_id='+checkoutHash, function(data) {
					if(typeof data.success != 'undefined' && !data.success) {
						_this.Order._polling[checkoutHash] = false;
						_this.Spinner.hide();
						
						_this.Debug(data.error.message, 'error', true);
						_this.Analytics.track('Paddle.Order.Details.Poll.Error', {}, {
							Message: data.error.message
						});
						
						if(typeof callback == 'function') {
							callback(false);
						} else {
							alert('Sorry, there was an error retrieving the requested order details.');
						}
					} else {
						if(data.state != 'processed') {
							_this.Order._pollAttempts[checkoutHash] = typeof _this.Order._pollAttempts[checkoutHash] != 'undefined' ? _this.Order._pollAttempts[checkoutHash] : 0;
							
							if(_this.Order._pollAttempts[checkoutHash] <= _this.Order._maxPollAttempts) {
								_this.Order._pollAttempts[checkoutHash]++;
								
								setTimeout(function() {
									_this.Order.poll(checkoutHash, callback);
								}, 600);
							} else {
								_this.Order._polling[checkoutHash] = false;
								_this.Spinner.hide();
								
								_this.Debug('Order stopped polling as maximum attempts of '+_this.Order._maxPollAttempts+' reached.', 'error', true);
								_this.Analytics.track('Paddle.Order.Details.Poll.NoResult', {}, {});
								
								if(typeof callback == 'function') {
									callback(false);
								} else {
									alert('Your order has been completed, please check your email for further information.');
								}
							}
						} else {
							_this.Order._polling[checkoutHash] = false;
							
							_this.Analytics.track('Paddle.Order.Details.Poll.Completed', {}, {
								'CheckoutID': checkoutHash
							});
							
							_this.Debug('Order details retrieved successfully from Paddle API.');
							
							if(typeof callback == 'function') {
								callback(data);
							} else {
								_this.Debug('Callback passed to details() is not a function.', 'warning');
							}
						}
					}
				});
			}
			
		};
		
		// Download tracking & prompts.
		this.Download = {
			
			// load() invokes all of the items with 'paddle_download' class on the page.
			load: function() {
				_util.ready(function() {					
					var buttonCounter = 0;
					_util.each('paddle_download', function(buttonElement) {
						// Has this button already been initialised?
						var _buttonHasInit = (buttonElement.getAttribute('data-init') == 'true');
						
						if(!_buttonHasInit) {
							buttonElement.setAttribute('data-init', 'true');
							
							var downloadProductId = buttonElement.getAttribute('data-download') || false;
							var downloadUrl = buttonElement.getAttribute('data-download-url') || false;
							var prompt = (buttonElement.getAttribute('data-download-prompt') == 'false') ? false : true;
							
							var heading = buttonElement.getAttribute('data-download-heading') || false;
							var subHeading = buttonElement.getAttribute('data-download-subheading') || false;
							var cta = buttonElement.getAttribute('data-download-cta') || false;
							
							var popupAttributes = {
								heading: heading,
								subHeading: subHeading,
								cta: cta
							};
							
							buttonElement.onclick = function(e) {
								e.preventDefault();
								
								if(downloadProductId || downloadUrl) {
									if(downloadProductId) {
										var productDownloadUrl = _this.Download.GetURLFromID(downloadProductId);
										if(productDownloadUrl) {
											if(prompt) {
												_this.Download.StartWithPrompt(productDownloadUrl, downloadProductId, popupAttributes);
											} else {
												_this.Download.Start(productDownloadUrl, downloadProductId);
											}
										}
									} else if(downloadUrl) {
										if(prompt) {
											_this.Download.StartWithPrompt(downloadUrl, false, popupAttributes);
										} else {
											_this.Download.Start(downloadUrl);
										}
									}								
								}
							};
						}
					});
				});
			},
			
			StartWithPrompt: function(url, product_id, popupAttributes) {
				var product_id = typeof product_id != 'undefined' ? product_id : false;
				
				_this.Analytics.track('Paddle.Download.Prompt.Start', {}, {
					'ProductID': product_id || false,
					'DownloadUrl': url
				});
				
				var downloadPopup = _this.Audience.Popup({
					triggers: {
						timed: false,
						exitIntent: false,
						scrollDepth: false
					},
					strings: {
						heading: (popupAttributes.heading) ? popupAttributes.heading : "Enter your email to download!",
						subHeading: (popupAttributes.subHeading) ? popupAttributes.subHeading : "Enter your email address to begin the download.",
						cta: (popupAttributes.cta) ? popupAttributes.cta : "Download!",
						successMessage: null
					},
					callback: function(data) {
						if(data.success) {
							_this.Analytics.track('Paddle.Download.Prompt.Success', {}, {
								'ProductID': product_id || false,
								'DownloadUrl': url
							});
							
							_this.Download.Start(url, product_id);
						}
					}
				});
				
				_this.Popup.show(downloadPopup, 'Download', 'download');
			},
			
			GetURLFromID: function(product_id) {
				if(typeof product_id != 'undefined' && product_id != '') {
					return 'https://vendors.paddle.com/download/product/'+product_id;
				} else {
					return false;
				}
			},
			
			Start: function(url, product_id) {
				var product_id = typeof product_id != 'undefined' ? product_id : false;
				
				if(typeof url != 'undefined' && url != '') {
					_this.Debug('Download started.');
					_this.Analytics.track('Paddle.Download.Start', {}, {
						'ProductID': product_id || false,
						'DownloadUrl': url
					});
					_this.Affiliate.Event('Download');
					
					window.location = url;
				} else {
					_this.Debug('Unable to start download, no URL specified.', 'warning');
				}
			}
			
		};
		
		// Generic popup/modal methods
		this.Popup = {
			
			show: function(popupInstance, method, type) {
				var type = typeof type != 'undefined' ? type : 'popup';
				var method = typeof method != 'undefined' ? method : 'Manual'; // manual / timed / scrollDepth / exitIntent / etc...
				
				// Only allow the popup if the user hasn't seen one recently (or it's user invoked).
				if(method == 'Manual' || method == 'Download' || method == 'Order' || _this.Audience.AllowPopup()) {	
					_this.Debug("Popup triggered. (Method: "+method+" | Type: "+type+")");
					
					var popup = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0] || false;
					if(popup) {
						if(method != 'Manual' && method != 'Download' && method != 'Order') {
							_this.Audience.LogPopup();
						}
						
						_util.show(popup);
					}
					
					// @todo Support new 'Conversation' type.
					if(type == 'audience') {
						_this.Analytics.track('Paddle.Audience.Popup.Show', {}, {
							'PopupMethod': method
						});
					} else if(type == 'order') {
						_this.Analytics.track('Paddle.Order.Popup.Show', {}, {});
					} else if(type == 'download') {
						_this.Analytics.track('Paddle.Download.Popup.Show', {}, {});
					} else {
						_this.Analytics.track('Paddle.Popup.Generic.Show', {}, {});
					}
				} else {
					_this.Debug("Popup trigger ignored, user has seen a popup recently.", "warning");
				}
			},
			
			hide: function(popupInstance, type) {
				var type = typeof type != 'undefined' ? type : 'popup';
				var popup = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0] || false;
				var popupBox = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup')[0] || false;
				
				if(popup && popupBox) {
					_this.Debug("Popup dismissed. (Type: "+type+")");
					
					_util.addClass(popupBox, 'paddle-fadeOutUpBig');
					_util.addClass(popup, 'paddle-fadeOut');
					
					setTimeout(function() {
						_util.removeClass(popup, 'paddle-fadeOut');
						_util.removeClass(popupBox, 'paddle-fadeOutUpBig')
						_util.hide(popup);
					}, 600);
				}
				
				if(type == 'audience') {
					_this.Analytics.track('Paddle.Audience.Popup.Dismiss', {}, {});
				} else if(type == 'order') {
					_this.Analytics.track('Paddle.Order.Popup.Dismiss', {}, {});
				} else if(type == 'download') {
					_this.Analytics.track('Paddle.Download.Popup.Dismiss', {}, {});
				} else {
					_this.Analytics.track('Paddle.Popup.Generic.Dismiss', {}, {});
				}
			}
			
		};
		
		// Audience Subscription APIs
		this.Audience = {
			
			LogPopup: function() {
				// Set cookie, we won't show an automatic popup for 6 days.
				_util.setCookie(_defaults.popupCookie, '1', 6);
			},
			
			AllowPopup: function() {
				// Check cookie, if it's set, don't show the popup.
				var popup = _util.getCookie(_defaults.popupCookie);
				if(popup && popup == '1') {
					return false;
				} else {
					return true;
				}
			},
			
			Popup: function(inputAttributes) {
				var popupInstance = '_'+Math.ceil(Math.random()*10000000);
				
				// Build 'attributes' object, wih default values, based on inputs passed to function.
				var attributes = {
					triggers: {
						exitIntent: (typeof ((inputAttributes || {}).triggers || {}).exitIntent != 'undefined') ? inputAttributes.triggers.exitIntent : true,
						scrollDepth: (typeof ((inputAttributes || {}).triggers || {}).scrollDepth != 'undefined') ? inputAttributes.triggers.scrollDepth : false, // false or value in px
						timed: (typeof ((inputAttributes || {}).triggers || {}).timed != 'undefined') ? inputAttributes.triggers.timed : false // false or value in seconds
					},
					allowDismiss: (typeof (inputAttributes || {}).allowDismiss != 'undefined') ? inputAttributes.allowDismiss : true,
					dismissColor: (typeof (inputAttributes || {}).dismissColor != 'undefined') ? inputAttributes.dismissColor : 'dark',
					strings: {
						heading: (typeof ((inputAttributes || {}).strings || {}).heading != 'undefined') ? inputAttributes.strings.heading : "Subscribe for updates!",
						subHeading: (typeof ((inputAttributes || {}).strings || {}).subHeading != 'undefined') ? inputAttributes.strings.subHeading : "Subscribe to our email newsletter, and stay updated with our latest products, developments and offers.",
						emailPlaceholder: (typeof ((inputAttributes || {}).strings || {}).emailPlaceholder != 'undefined') ? inputAttributes.strings.emailPlaceholder : "Email Address...",
						cta: (typeof ((inputAttributes || {}).strings || {}).cta != 'undefined') ? inputAttributes.strings.cta : "Subscribe!",
						successMessage: (typeof ((inputAttributes || {}).strings || {}).successMessage != 'undefined') ? inputAttributes.strings.successMessage : "Success! You are now subscribed!",
					},
					view: {
						animations: {
							show: (typeof (((inputAttributes || {}).view || {}).animations || {}).show != 'undefined') ? inputAttributes.view.animations.show : "bounceIn",
							hide: (typeof (((inputAttributes || {}).view || {}).animations || {}).hide != 'undefined') ? inputAttributes.view.animations.hide : "fadeOutUpBig"
						},
						styles: {
							heading: {
								textColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).heading || {}).textColor != 'undefined') ? inputAttributes.view.styles.heading.textColor : "#000000"
							},
							subHeading: {
								textColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).subHeading || {}).textColor != 'undefined') ? inputAttributes.view.styles.subHeading.textColor : "#666666"
							},
							popup: {
								backgroundColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup  || {}).backgroundColor != 'undefined') ? inputAttributes.view.styles.popup.backgroundColor : "#FFFFFF",
								backgroundImage: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundImage != 'undefined') ? inputAttributes.view.styles.popup.backgroundImage : false,
								backgroundSize: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundSize != 'undefined') ? inputAttributes.view.styles.popup.backgroundSize : false,
								backgroundPosition: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundPosition != 'undefined') ? inputAttributes.view.styles.popup.backgroundPosition : false,
								backgroundRepeat: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundRepeat != 'undefined') ? inputAttributes.view.styles.popup.backgroundRepeat : false
							},
							cta: {
								backgroundColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).cta || {}).backgroundColor != 'undefined') ? inputAttributes.view.styles.cta.backgroundColor : "#4CAF50",
								textColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).cta || {}).textColor != 'undefined') ? inputAttributes.view.styles.cta.textColor : "#FFFFFF"
							}
						}
					},
					callback: (typeof (inputAttributes || {}).callback != 'undefined') ? inputAttributes.callback : false
				};
				
				var popupHtml = '<div class="paddle-popup paddle-animated paddle-'+attributes.view.animations.show+'">';

					if(attributes.allowDismiss) {
						popupHtml += '<div class="paddle-popup-close">';
							popupHtml += '<a class="paddle-popup-close-image" href="#!"><img src="https://cdn.paddle.com/paddle/assets/images/close-'+attributes.dismissColor+'.png" border="0" /></a>';
						popupHtml += '</div>';
					}
					
					var popupBackground = '';
					if(attributes.view.styles.popup.backgroundImage) {
						popupBackground += 'background-image: url(\''+attributes.view.styles.popup.backgroundImage+'\');';
						
						if(attributes.view.styles.popup.backgroundSize) {
							popupBackground += 'background-size: '+attributes.view.styles.popup.backgroundSize+';';
						}
						
						if(attributes.view.styles.popup.backgroundPosition) {
							popupBackground += 'background-position: '+attributes.view.styles.popup.backgroundPosition+';';
						}
						
						if(attributes.view.styles.popup.backgroundRepeat) {
							popupBackground += 'background-repeat: '+attributes.view.styles.popup.backgroundRepeat+';';
						}
					}
					
					popupHtml += '<div class="paddle-popup-inner" style="background-color: '+attributes.view.styles.popup.backgroundColor+'; '+popupBackground+'">';
				
						if(attributes.strings.heading) {
							popupHtml += '<div class="paddle-popup-heading" style="color: '+attributes.view.styles.heading.textColor+';">'+attributes.strings.heading+'</div>';
						}
						
						if(attributes.strings.subHeading) {
							popupHtml += '<div class="paddle-popup-subheading" style="color: '+attributes.view.styles.subHeading.textColor+';">'+attributes.strings.subHeading+'</div>';
						}
					
						popupHtml += '<div class="paddle-popup-form">';
							popupHtml += '<input type="text" class="paddle-popup-field paddle-popup-email" placeholder="'+attributes.strings.emailPlaceholder+'" />';
							popupHtml += '<input type="button" class="paddle-popup-cta" value="'+attributes.strings.cta+'" style="color: '+attributes.view.styles.cta.textColor+'; background-color: '+attributes.view.styles.cta.backgroundColor+';" />';
						popupHtml += '</div>';
					
					popupHtml += '</div>';
				popupHtml += '</div>';
				
				_util.ready(function() {
					var body = document.getElementsByTagName('body')[0];
					var audiencePopup = document.createElement('div');
					audiencePopup.setAttribute('class', 'paddle-reset paddle-popup-container paddle-popup-instance_'+popupInstance+' paddle-animated paddle-fadeIn paddle-hidden');
					audiencePopup.innerHTML = popupHtml;
					body.appendChild(audiencePopup);
					
					var close = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-close-image')[0];
					close.onclick = function(e) {
						e.preventDefault();
						_this.Popup.hide(popupInstance, 'audience');
					};
					
					var submit = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-cta')[0];
					submit.onclick = function() {
						_this.Audience.popupSubmit(popupInstance, attributes.strings.successMessage, attributes.callback);
					};
					
					var input = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-email')[0];
					input.onkeyup = function(e) {
						if(e.keyCode == 13) {
							e.preventDefault();
							_this.Audience.popupSubmit(popupInstance, attributes.strings.successMessage, attributes.callback);
						}
					};
					
					// Setup Popup Triggers
					if(attributes.triggers.exitIntent) {
						_this.Debug("Exit-intent audience popup enabled, will pop upon users moust entering browser address bar/tabs.");
						document.addEventListener('mouseleave', function(e) {
							if(e.clientY <= 0) {
								_this.Popup.show(popupInstance, 'ExitIntent', 'audience');
							}
						});
					}
					
					if(attributes.triggers.scrollDepth !== false) {
						if(attributes.triggers.scrollDepth === true) {
							_this.Debug("Scroll-depth audience popup enabled, will pop with any scroll activity.");
						} else {
							_this.Debug("Scroll-depth audience popup enabled, will pop after scrolling "+attributes.triggers.scrollDepth+"px.");
						}
						
						_status.AudienceHasPopped = false;
						_status.AudienceLoadScrollDepth = window.scrollY;
						
						if(_status.AudienceLoadScrollDepth <= 100) {
							window.onscroll = function(e) {
								clearTimeout(_status.AudienceCheckScrollDepth);
								window.checkScrollDepth = setTimeout(function() {
									var scrollDepth = window.scrollY;
									
									if(scrollDepth >= attributes.triggers.scrollDepth) {
										if(!_status.AudienceHasPopped) {
											_status.AudienceHasPopped = true;
											_this.Popup.show(popupInstance, 'ScrollDepth', 'audience');
										}
									}
								}, 300);
							};
						}
					}
					
					if(attributes.triggers.timed) {
						_this.Debug("Timed audience popup enabled, popping in "+attributes.triggers.timed+" seconds.");
						setTimeout(function() {
							_this.Popup.show(popupInstance, 'Timed', 'audience');
						}, attributes.triggers.timed*1000);
					}
				});
				
				return popupInstance;
			},
			
			emailFromPopup: function(popupInstance) {
				var email = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-email')[0] || false;
				if(email) {
					return email.value;
				} else {
					return false;
				}
			},
			
			popupSubmit: function(popupInstance, successMessage, callback) {
				_this.Debug("Audience popup submitted.");
				
				var email = _this.Audience.emailFromPopup(popupInstance);
				if(email && email != '') {
					_this.Spinner.show();
					_this.Audience.subscribe(email, function(data) {
						_this.Spinner.hide();
						
						if(data.success) {
							if(typeof callback == 'function') {
								callback(data);
							}
							
							if(successMessage) {
								alert(successMessage);
							}
							
							_this.Popup.hide(popupInstance, 'audience');
						} else {
							if(typeof callback == 'function') {
								callback(data);
							}
							
							alert('Error: '+data.error);
						}
					});
				} else {
					alert('Please enter a valid email address.');
				}
			},
			
			subscribe: function(email, callback) {
				_this.Debug("Audience subscription API triggered.");
				
				var audienceApi = _this.Environment.defaults().audienceApi.replace('{vendor_id}', _options.vendor);
				
				_this.Analytics.track('Paddle.Audience.Subscribe.Submit', {}, {});
				_util.jsonp(audienceApi+'?source=Import&medium=Paddle.js&email='+encodeURIComponent(email), function(data) {
					if(typeof data.success != 'undefined' && data.success === false) {
						_this.Analytics.track('Paddle.Audience.Subscribe.Error', {}, {
							'Error.Message': data.error.message
						});
						
						if(typeof callback == 'function') {
							callback({
								success: false,
								error: data.error.message
							});
						} else if(typeof window[callback] == 'function') {
							window[callback]({
								success: false,
								error: data.error.message
							});
						} else {
							alert(data.error.message);
						}
					} else {
						if(data.user_id) {
							_this.Analytics.track('Paddle.Audience.Subscribe.Success', {
								user: {
									id: data.user_id,
									email: email
								}
							}, {});
							_this.Affiliate.Event('Audience.Subscribe');
							
							if(typeof callback == 'function') {
								callback({
									success: true,
									email: email,
									user_id: data.user_id
								});
							} else if(typeof window[callback] == 'function') {
								window[callback]({
									success: true,
									email: email,
									user_id: data.user_id
								});
							} else {
								alert("You've been subscribed successfully!");
							}
						}
					}
				});
			}
			
		};
		
		// Devmate
		this.Devmate = {
			
			Active: function() {
				var devmateCookieValue = _util.getCookie(_defaults.devmateCookie);
				return devmateCookieValue && devmateCookieValue != '' ? true : false;
			},
			
			Session: function() {
				if(_this.Devmate.Active()) {
					return _util.getCookie(_defaults.devmateCookie) || null;
				} else {
					return null;
				}
			}
			
		};
			
		// Checkout handling functions.
		this.Checkout = {
			
			open: function(checkoutAttributes, invocationMethod) {				
				_util.closeCheckout(null, false, false);
								
				if(!window.PaddleCompletedSetup) {
					_this.Debug("You haven't called Paddle.Setup(), using Paddle.js without calling Paddle.Setup() is unsupported and may result in unwanted issues. Docs: https://www.paddle.com/docs/paddle-js-overlay-checkout", 'warning', true);
				}
				
				if(typeof invocationMethod == 'undefined') {
					var invocationMethod = 'function';
				}
				
				if(typeof checkoutAttributes == 'object') {
					// Determine how we should open the checkout
					if(typeof checkoutAttributes.method != 'undefined') {
						if(checkoutAttributes.method == 'overlay') {
							var checkoutMethod = 'overlay';
						} else if(checkoutAttributes.method == 'window') {
							var checkoutMethod = 'window';
						} else if(checkoutAttributes.method == 'inline') {
							var checkoutMethod = 'inline';
						} else {
							checkoutAttributes.method = 'overlay';
							var checkoutMethod = 'overlay';
						}
					} else {
						checkoutAttributes.method = 'overlay';
						var checkoutMethod = 'overlay';
					}
					
					// If 'prices' is specified, convert these to URL params.
					if(typeof checkoutAttributes.prices == 'object') {
						checkoutAttributes.prices.forEach(function(price) {
							checkoutAttributes['price_'+price.currency.toLowerCase()] = price.price.toString();
							checkoutAttributes['price_'+price.currency.toLowerCase()+'_auth'] = price.auth;
							
							if(typeof price.price != 'string') {
								_this.Debug('The price override "price" value is specified as a float/integer. It is recommended that you pass prices as strings to ensure the precision of the number is retained when calculating the authentication hash.', 'warning', true);
							}
						});
						
						delete checkoutAttributes.prices;						
					}
					
					// If 'recurringPrices' is specified, convert these to URL params.
					if(typeof checkoutAttributes.recurringPrices == 'object') {
						checkoutAttributes.recurringPrices.forEach(function(price) {
							checkoutAttributes['recurring_price_'+price.currency.toLowerCase()] = price.price.toString();
							checkoutAttributes['recurring_price_'+price.currency.toLowerCase()+'_auth'] = price.auth;
							
							if(typeof price.price != 'string') {
								_this.Debug('The recurring price override "price" value is specified as a float/integer. It is recommended that you pass prices as strings to ensure the precision of the number is retained when calculating the authentication hash.', 'warning', true);
							}
						});
						
						delete checkoutAttributes.recurringPrices;
					}
					
					// Override mobile sessions to use 'window' method.
					// Override SDK sessions to use 'sdk' method.
					if(_options.sdk) {
						checkoutAttributes.method = 'sdk';
						var checkoutMethod = 'sdk';
					} else {
						// @note Disable overriding of mobile sessions to use overlay (once below implemented).
						// @note Implement: https://github.com/stripe/mobile-viewport-control
						/*
						if(_util.isMobile() && checkoutMethod != 'inline') {
							checkoutAttributes.method = 'window';
							var checkoutMethod = 'window';
						}
						*/
					}
					
					// You can only have one open checkout at a time, we load the active checkout's attributes into the _activeCheckout object for use in other methods
					_activeCheckout = checkoutAttributes;
					
					// If this is an Upsell Checkout track that it has been opened.
					if(_activeCheckout.isUpsell) {
						_this.Analytics.track('Paddle.Checkout.Upsell.Click', {}, {
							'Upsell.Product': _activeCheckout.product
						});
						
						// Show the 'Return to Previous Checkout' button...
						setTimeout(function() {
							var original = document.getElementById('paddle_upsell_original');
							if(original) {
								original.setAttribute('style', 'display:block;');
							}
						}, 1850);
					}
					
					// Take the 'data-referrer' if specified in the attributes object, and add to the campaign object.
					if(checkoutAttributes.referring_domain != null && checkoutAttributes.referring_domain != '' && checkoutAttributes.referring_domain) {
						_util.setPaddleCampaign(checkoutAttributes.referring_domain);
					}
					
					// Build the 'referring_domain' parameter based on our campaign values:
					checkoutAttributes.referring_domain = _util.buildPaddleReferrerString();
					
					// Convert passthrough to string if object
					if(typeof checkoutAttributes.passthrough == 'object') {
						checkoutAttributes.passthrough = JSON.stringify(checkoutAttributes.passthrough);
					}
					
					// Map 'nicely' name field to their actual names needed for the URL (this way you can pass either the ugly or nice names to the function)
					//var reset = false;
					if(typeof checkoutAttributes.email != 'undefined') {
						//reset = true;
						
						checkoutAttributes.guest_email = checkoutAttributes.email;
						delete checkoutAttributes.email;
					}
					
					if(typeof checkoutAttributes.country != 'undefined') {
						//reset = true;
						
						checkoutAttributes.guest_country = checkoutAttributes.country;
						delete checkoutAttributes.country;
					}
					
					if(typeof checkoutAttributes.postcode != 'undefined') {
						//reset = true;
						
						checkoutAttributes.guest_postcode = checkoutAttributes.postcode;
						delete checkoutAttributes.postcode;
					}
					
					//if(reset) {
					//	checkoutAttributes.reset = 'all';
					//}
					
					if(typeof checkoutAttributes.trialDays != 'undefined') {
						checkoutAttributes.trial_days = checkoutAttributes.trialDays;
						delete checkoutAttributes.trialDays;
					}
					
					if(typeof checkoutAttributes.trialDaysAuth != 'undefined') {
						checkoutAttributes.trial_days_auth = checkoutAttributes.trialDaysAuth;
						delete checkoutAttributes.trialDaysAuth;
					}
					
					if(typeof checkoutAttributes.allowQuantity != 'undefined') {
						if(checkoutAttributes.allowQuantity == true || checkoutAttributes.allowQuantity == 'true' || checkoutAttributes.allowQuantity == '1' || checkoutAttributes.allowQuantity == 1) {
							checkoutAttributes.quantity_variable = '1';
						} else {
							checkoutAttributes.quantity_variable = '0';
						}
						delete checkoutAttributes.allowQuantity;
					}
					
					if(typeof checkoutAttributes.message != 'undefined') {
						checkoutAttributes.custom_message = checkoutAttributes.message;
						delete checkoutAttributes.message;
					}
					
					if(typeof checkoutAttributes.disableLogout != 'undefined') {
						checkoutAttributes.disable_logout = checkoutAttributes.disableLogout;
						delete checkoutAttributes.disableLogout;
					}
					
					// Format checkoutAttributes better for the checkout URLs
					delete checkoutAttributes.theme;
					
					// Set Checkout Variant
					checkoutAttributes.checkout_layout = _options.checkoutVariant ? typeof _options.checkoutVariant.variant != 'undefined' ? _options.checkoutVariant.variant : 'multipage' : 'multipage';
					
					// Output current variant.
					_this.Debug('Checkout Variant: '+checkoutAttributes.checkout_layout);
					
					_this.Debug('Creating checkout with attributes: '+JSON.stringify(checkoutAttributes));
					
					// Create Product Upsell **Beta**
					// @note Only show product upsells on overlay checkout.
					if(checkoutMethod == 'overlay' && typeof checkoutAttributes.upsell != 'undefined' && checkoutAttributes.upsell != '') {
						var hasUpsell = true;
						
						_util.jsonp(_this.Environment.defaults().dataApi+'?product_id='+checkoutAttributes.upsell, function(data) {
							var imageUrl = data.image;
							var title = (typeof checkoutAttributes.upsellTitle != 'undefined') ? checkoutAttributes.upsellTitle : 'Upgrade to '+data.name+'!';
							var description = (typeof checkoutAttributes.upsellText != 'undefined') ? checkoutAttributes.upsellText : 'Why not upgrade your purchase to '+data.name+'?';
							var ctaText = (typeof checkoutAttributes.upsellAction != 'undefined') ? checkoutAttributes.upsellAction : 'Upgrade to '+data.name+'!';
							var orginalCheckout = function() { _util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, false); };
							var passthrough = (typeof checkoutAttributes.upsellPassthrough != 'undefined' && checkoutAttributes.upsellPassthrough != false && checkoutAttributes.upsellPassthrough != '') ? checkoutAttributes.upsellPassthrough : (typeof checkoutAttributes.passthrough != 'undefined' && checkoutAttributes.passthrough != '' && checkoutAttributes.passthrough != false) ? checkoutAttributes.passthrough : '' || '';
							var upsellCoupon = (typeof checkoutAttributes.upsellCoupon != 'undefined') ? checkoutAttributes.upsellCoupon : '';
							
							_this.Upsell.create(checkoutAttributes.upsell, imageUrl, title, description, ctaText, orginalCheckout, passthrough, upsellCoupon);
						});
					} else {
						var hasUpsell = false;
					}
					
					// Set Devmate passthrough value.
					if(_this.Devmate.Active()) {
						_this.Debug("DevMate Session Active: "+_this.Devmate.Session());
						if(typeof checkoutAttributes.passthrough == 'undefined' || checkoutAttributes.passthrough == '') {
							checkoutAttributes.passthrough = _this.Devmate.Session() || checkoutAttributes.passthrough || "";
							_this.Debug("DevMate tracking parameter set as passthrough value.");
						} else {
							_this.Debug("DevMate tracking parameter NOT SET as passthrough value, as an existing passthrough was already in use. Sales won't be fully attributed within DevMate.");
						}
					}
					
					// Open checkout...
					if(checkoutMethod == 'sdk') {
						checkoutAttributes.display_mode = 'sdk';
						_util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, false);
					} else if(checkoutMethod == 'overlay') {
						checkoutAttributes.display_mode = 'overlay';
						_util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, false);
					} else if(checkoutMethod == 'inline') {
						checkoutAttributes.display_mode = 'inline';
						_util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, true);
					} else {
						checkoutAttributes.display_mode = 'popup';
						_util.renderCheckoutWindow(checkoutAttributes.product, checkoutAttributes);
					}
					
					if(_options.enableTracking) {
						_this.Analytics.track('Paddle.Checkout.Open', {}, {
							'OpenMethod': checkoutMethod,
							'InvokedVia': invocationMethod,
							'Upsell.HasUpsell': hasUpsell,
							'Upsell.IsUpsell': _activeCheckout.isUpsell,
							'Devmate.Active': _this.Devmate.Active()
						});
					}
					
					_this.Affiliate.Event('Checkout.Open');
				} else {
					throw new Error("[PADDLE] An object of checkout parameters must be passed to Paddle.Checkout.open()");
				}
			}
			
		};
		
		// Upsells
		this.Upsell = {
			
			// Creates the CSS for the upsell widget.
			css: function(leftPosition) {
				var leftPosition = (typeof leftPosition != 'undefined') ? leftPosition : '-300px';
				
				return 'position: fixed; z-index: 999999; top: 140px; left: '+leftPosition+'; background: #FFFFFF; padding: 17px; border-radius: 3px; width: 265px; box-shadow: 0px 1px 4px 1px rgba(0,0,0,0.13); box-sizing: content-box;';
			},
			
			// Creates the HTML div for the upsell widget from product data.
			create: function(productId, imageUrl, title, description, ctaText, orginalCheckoutFunction, passthrough, upsellCoupon) {
				window.UpsellPosition = -350;
				
				var ctaText = (typeof ctaText != 'undefined') ? ctaText : 'Buy Now!';
				var upsellCoupon = (typeof upsellCoupon != 'undefined') ? upsellCoupon : '';
				
				var body = document.getElementsByTagName('body')[0];
				var upsell = document.createElement('div');
				upsell.setAttribute('id', 'paddle_upsell_'+productId);
				upsell.setAttribute('class', 'paddle_upsell');
				upsell.setAttribute('style', _this.Upsell.css());
				
				// Checkbox vs Button Upsell
				if(_options.upsellCheckbox) {
					window.upsellType = 'Checkbox';
					var upsellAction = '<div class="paddle_upsell-cta-checkbox-container"><div class="paddle_upsell-cta paddle_upsell-cta-checkbox"><input type="checkbox" class="paddle_upsell-checkbox" id="paddle_upsell-checkbox" onchange="javascript:document.getElementsByClassName(\'paddle_upsell_button\')[0].click();" /> <label for="paddle_upsell-checkbox">'+ctaText+'</label><a href="#!" class="paddle_button paddle_upsell_button" style="visibility:none;" data-theme="none" data-product="'+productId+'" data-upsell-button="true" data-referrer="Upsell" data-passthrough="'+passthrough+'" data-coupon="'+upsellCoupon+'" data-email="'+(_activeCheckout.guest_email || "")+'" data-country="'+(_activeCheckout.guest_country || "")+'" data-postcode="'+(_activeCheckout.guest_postcode || "")+'"></a></div></div>';
				} else {
					window.upsellType = 'Button';
					var upsellAction = '<div class="paddle_upsell-cta"><a href="#" class="paddle_upsell_button paddle_button" data-product="'+productId+'" data-upsell-button="true" data-referrer="Upsell" data-passthrough="'+passthrough+'" data-coupon="'+upsellCoupon+'" data-email="'+(_activeCheckout.guest_email || "")+'" data-country="'+(_activeCheckout.guest_country || "")+'" data-postcode="'+(_activeCheckout.guest_postcode || "")+'">'+ctaText+'</a></div>';
				}
				
				upsell.innerHTML = '<div class="paddle_upsell-wrapper"><div class="paddle_upsell-icon" style="background-image: url(\''+imageUrl+'\');"></div><div class="paddle_upsell-data"><div class="paddle_upsell-title">'+title+'</div><div class="paddle_upsell-text">'+description+'</div>'+upsellAction+'</div></div>';
				body.appendChild(upsell);
				
				var original = document.createElement('div');
				original.setAttribute('id', 'paddle_upsell_original');
				original.setAttribute('class', 'paddle_upsell_original');
				original.setAttribute('style', 'display:none;');
				original.innerHTML = '<span class="paddle_upsell_original_link">&lsaquo; Back to Original Checkout</span>';
				original.onclick = function() {
					_util.closeCheckout(null);
					orginalCheckoutFunction();
				}
				body.appendChild(original);
								
				_this.Button.load();
			},
			
			// Slides in the specified product upsell.
			display: function(productId) {				
				var upsell = document.getElementById('paddle_upsell_'+productId);
				if(upsell) {
					upsell.setAttribute('style', _this.Upsell.css('calc(50% + 245px)'));
				}
				
				_this.Analytics.track('Paddle.Checkout.Upsell.Impression', {}, {
					'Upsell.OriginalProduct': _activeCheckout.product,
					'Upsell.UpsoldProduct': productId,
					'Upsell.Type': window.upsellType || null
				});
			},
			
			// Slides out/hides the specified product upsell.
			close: function(productId) {
				var upsell = document.getElementById('paddle_upsell_'+productId);
				if(upsell) {
					upsell.setAttribute('style', _this.Upsell.css('-350px'));
				}
			}
			
		};
		
		// Public methods for working with loading spinners.
		this.Spinner = {
			
			show: function() {
				_util.showLoading();
			},
			
			hide: function() {
				_util.hideLoading();
			}
			
		};
		
		// Animation Library
		this.Animation = {
			
			addStylesheet: function() {
				if(!_this.Status.loadedAnimationStylesheet) {
					var head  = document.getElementsByTagName('head')[0];
					var link  = document.createElement('link');
					link.rel  = 'stylesheet';
					link.type = 'text/css';
					link.href = _defaults.animationCssFile;
					link.media = 'all';
					head.appendChild(link);
				
					_this.Status.loadedAnimationStylesheet = true;
				}
			}
			
		};
		
		// Checkout button handling functions.
		this.Button = {
			addStylesheet: function() {
				if(!_this.Status.loadedButtonStylesheet) {
					var head  = document.getElementsByTagName('head')[0];
					var link  = document.createElement('link');
					link.rel  = 'stylesheet';
					link.type = 'text/css';
					link.href = _defaults.paddleCssFile;
					link.media = 'all';
					head.appendChild(link);
				
					_this.Status.loadedButtonStylesheet = true;
				}
			},
			
			addTheme: function(buttonElement, theme) {
				if(theme != 'none') {
					_util.addClass(buttonElement, 'paddle_styled_button');
					
					if(theme == 'green') {
						_util.addClass(buttonElement, 'green');
					} else if(theme == 'light') {
						_util.addClass(buttonElement, 'light');
					} else if(theme == 'dark') {
						_util.addClass(buttonElement, 'dark');
					}
				}
			},
			
			attribute: function(attributesObject, attributesObjectKey, buttonElement, attributeName, attributeDefault) {
				if(typeof attributeDefault == 'undefined') {
					var attributeDefault = false;
				}
				
				var attributeValue = (buttonElement.getAttribute(attributeName) != '' && buttonElement.getAttribute(attributeName) != null) ? buttonElement.getAttribute(attributeName) : attributeDefault;
				
				if(attributeValue) {
					attributesObject[attributesObjectKey] = attributeValue;
				}
				
				return attributesObject;
			},
			
			getButtonAttributes: function(buttonElement) {
				// Create a friendly object of recognised attributes from the button (named correctly)
				var buttonAttributes = {};
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'theme', buttonElement, 'data-theme', 'green');
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'product', buttonElement, 'data-product');
				
				// Go through each of the data-* parameters and add them to our attributes for the checkout.
				// Checkout Success Callback
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'successCallback', buttonElement, 'data-success-callback', null);
				
				// Checkout Load Callback
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'loadCallback', buttonElement, 'data-load-callback', null);

				// Checkout Close Callback
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'closeCallback', buttonElement, 'data-close-callback', null);
				
				// Success Redirect
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'success', buttonElement, 'data-success');
				
				// Price Override
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'price', buttonElement, 'data-price', '');
				
				// Price Override Auth
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'auth', buttonElement, 'data-auth', '');
				
				// Trial Days
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'trial_days', buttonElement, 'data-trial-days', '');
				
				// Trial Days Auth
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'trial_days_auth', buttonElement, 'data-trial-days-auth', '');
				
				// Guest Email
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'guest_email', buttonElement, 'data-email', '');
				
				// Guest Country
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'guest_country', buttonElement, 'data-country', '');
				
				// Guest Postcode
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'guest_postcode', buttonElement, 'data-postcode', '');
				
					// If Guest Email, Country or Postcode is passed, tell the checkout to add a session reset.
					//var shouldReset = buttonAttributes.guest_email || buttonAttributes.guest_country || buttonAttributes.guest_postcode || false;
					//if(shouldReset !== false) {
					//	buttonAttributes.reset = 'all';
					//}
				
				// Passthrough
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'passthrough', buttonElement, 'data-passthrough', '');
				
				// Upsell Passthrough
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellPassthrough', buttonElement, 'data-upsell-passthrough', false);
				
				// Coupon
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'coupon', buttonElement, 'data-coupon', '');
				
				// Locale
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'locale', buttonElement, 'data-locale', '');
				
				// Quantity
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'quantity', buttonElement, 'data-quantity', '');
				
				// Custom Message
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'custom_message', buttonElement, 'data-message', '');
				
				// Referrer
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'referring_domain', buttonElement, 'data-referrer', '');
				
				// Title
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'title', buttonElement, 'data-title', '');
				
				// Disable Logout
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'disable_logout', buttonElement, 'data-disable-logout', '');
				
				// Checkout Upsell Product
				// @note This is the product that is UPSOLD upon checkout open
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsell', buttonElement, 'data-upsell', '');
				
				// Upsell text.
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellText', buttonElement, 'data-upsell-text', false);
				
				// Upsell title.
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellTitle', buttonElement, 'data-upsell-title', false)
				
				// Upsell cta.
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellAction', buttonElement, 'data-upsell-action', false)
				
				// Upsell coupon.
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellCoupon', buttonElement, 'data-upsell-coupon', '')
				
				// Is an Upsell button click?
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'isUpsell', buttonElement, 'data-upsell-button', false);
				
				// Allow Quantity Changing
				// Don't use Button.attribute() for this one.
				if(buttonElement.getAttribute('data-allow-quantity') != '' && (buttonElement.getAttribute('data-allow-quantity') == 'false' || buttonElement.getAttribute('data-allow-quantity') === false || buttonElement.getAttribute('data-allow-quantity') == '0')) {
					buttonAttributes.quantity_variable = '0';
				} else {
					buttonAttributes.quantity_variable = '1';
				}
				
				// URL Override
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'override', buttonElement, 'data-override', '');
				
				// Internal Paddle Checkouts (Paddle Tools etc...)
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'internal', buttonElement, 'data-internal', '');
				
				// Internal Paddle Checkouts - Vendor
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'vendor', buttonElement, 'data-vendor', '');
				
				// Internal Paddle Checkouts - Plan
				buttonAttributes = _this.Button.attribute(buttonAttributes, 'plan', buttonElement, 'data-plan', '');
					
				return buttonAttributes;
			},
			
			load: function() {
				_util.ready(function() {					
					var buttonCounter = 0;
					_util.each('paddle_button', function(buttonElement) {
						// Has this button already been initialised?
						var _buttonHasInit = (buttonElement.getAttribute('data-init') == 'true');
						
						// If this isn't the first init, remove any Paddle click handlers, buttonAttributes is cached, this will force it to fetch fresh values.
						if(_buttonHasInit) {
							// This method of cloning the element means we do not have to keep track of handlers we've added.
							var buttonClone = buttonElement.cloneNode(true);
							buttonElement.parentNode.replaceChild(buttonClone, buttonElement);
							buttonElement = buttonClone;
						}
						
						// Get the Button Attributes for theme etc...
						var buttonAttributes = _this.Button.getButtonAttributes(buttonElement);
						
						// Apply theme to the button if required.
						if(buttonAttributes.theme != 'none') {
							var buttonTheme = buttonAttributes.theme;
							
							_this.Button.addTheme(buttonElement, buttonAttributes.theme);
						} else {
							var buttonTheme = 'none';
						}
						
						// Add an attribute indicating the button has a handler
						buttonElement.setAttribute('data-init', 'true');
						
						// Determine if the button is 'above the fold' (for Analytics)
						var bodyRect  = document.body.getBoundingClientRect(),
							elemRect  = buttonElement.getBoundingClientRect(),
							offset    = (elemRect.bottom-(elemRect.top-elemRect.bottom)) - bodyRect.top,
							bodyBound = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
						var aboveFold = (bodyBound > offset) ? true : false;
						
						_this.Analytics.track('Paddle.Button.Impression', {}, {
							'Button.Theme': buttonTheme,
							'Button.Text': buttonElement.innerHTML.replace(/(<([^>]+)>)/ig, "") || buttonElement.value || 'Unknown',
							'Button.AboveFold': aboveFold
						});
													
						// On click, we should open a checkout with friendly attributes object from above...
						buttonElement.addEventListener("click", function(event) {
							// Prevents page from scrolling to top if this is an anchor.
							event.preventDefault();
							
							// Get latest button attribures on each click.
							var buttonAttributes = _this.Button.getButtonAttributes(buttonElement);
							_this.Checkout.open(buttonAttributes, 'click');
						});
						
						buttonCounter++;
						
						// Send a sensible log message for each button rendered.
						if(buttonAttributes.override) {
							_this.Debug('Loaded and initiated checkout button for override URL: '+buttonAttributes.override+' (Paddle Button #'+buttonCounter+')');
						} else if(buttonAttributes.product) {
							_this.Debug('Loaded and initiated checkout button for product: '+buttonAttributes.product+' (Paddle Button #'+buttonCounter+')');
						} else {
							_this.Debug('Initiated a checkout button without an override URL or Product. (Paddle Button #'+buttonCounter+')', 'warning');
						}
					});
					
					// Replace paddle-gross with gross price, use productId from self, or fallback to parent if not set.
					_util.each('paddle-gross', function(grossElement) {
						var productId = grossElement.getAttribute('data-product') || false;
						var quantity = grossElement.getAttribute('data-quantity') || 1;
						
						if(!productId) {
							productId = grossElement.parentNode.getAttribute('data-product') || false;
						}
						
						if(productId) {
							var grossPrice = _this.Product.Price('gross', productId, quantity, function(amount) {
								grossElement.innerHTML = amount;
							});
						}
					});
					
					_util.each('paddle-tax', function(taxElement) {
						var productId = taxElement.getAttribute('data-product') || false;
						var quantity = taxElement.getAttribute('data-quantity') || 1;
						
						if(!productId) {
							productId = taxElement.parentNode.getAttribute('data-product') || false;
						}
						
						if(productId) {
							var taxPrice = _this.Product.Price('tax', productId, quantity, function(amount) {
								taxElement.innerHTML = amount;
							});
						}
					});
					
					_util.each('paddle-net', function(netElement) {
						var productId = netElement.getAttribute('data-product') || false;
						var quantity = netElement.getAttribute('data-quantity') || 1;
						
						if(!productId) {
							productId = netElement.parentNode.getAttribute('data-product') || false;
						}
						
						if(productId) {
							var netPrice = _this.Product.Price('net', productId, quantity, function(amount) {
								netElement.innerHTML = amount;
							});
						}
					});
				});
			}
		};
		
		// Public affiliate helper methods.
		this.Affiliate = {
			
			analyticsStart: function() {
				if(!_this.Status.failedLoadingAffiliateAnalytics) {
					if(!_this.Status.loadedAffiliateAnalytics) {						
						(function (e, t) { if (!t.__SV) {
							window.paddleAffiliateAnalytics = t; var n = e.createElement("script"); n.type = "text/javascript"; n.src = "http" + ("https:" === e.location.protocol ? "s" : "") + '://cdn.paddle.com/paddle/affiliate.js'; n.async = !0; var r = e.getElementsByTagName("script")[0]; r.parentNode.insertBefore(n, r); t.init = function (e, o) { t.writeKey = e; t._initOptions = o; t._execQueue = []; m = "action.track action.trackSale action.trackHTMLLink action.setGlobalProperty user.profile user.identify user.clear".split(" "); for (var n = 0; n < m.length; n++) { var f = function () { var r = m[n]; var s = function () { t._execQueue.push({ m: r, args: arguments }) }; var i = r.split("."); if (i.length == 2) { if (!t[i[0]]) { t[i[0]] = [] } t[i[0]][i[1]] = s } else { t[r] = s } }(); } }; t.__SV = 1 } })(document, window.paddleAffiliateAnalytics || []);
						
						try {
							paddleAffiliateAnalytics.init(_this.Environment.defaults().affiliateAnalyticsKey, {
								cookieName: _defaults.affiliateAnalyticsCookie
							});
						} catch(error) {
							_this.Status.failedLoadingAffiliateAnalytics = true;
							_this.Debug('Failed to start affiliate analytics with key: '+_this.Environment.defaults().affiliateAnalyticsKey, 'warning');
						}
												
						if(!_this.Status.failedLoadingAffiliateAnalytics) {
							_this.Status.loadedAffiliateAnalytics = true;
							_this.Debug('Affiliate Analytics Started');
						}
					}
				} else {
					_this.Debug('Won\'t attempt to initiate affiliate analytics after previous failure in same session.', 'warning');
				}
			},
			
			EndSession: function() {
				_this.Debug('Ending analytics session due to conversion taking place.');
				_util.setCookie(_defaults.campaignCookiePrefix+'affiliate_ignore', _this.Affiliate.affiliateToken(), 3);
				_util.removeCookie(_defaults.campaignCookiePrefix+'affiliate');
			},
			
			Event: function(event, additionalAttributes) {
				if(_this.Affiliate.isAffiliate()) {
					var affiliateToken = _this.Affiliate.affiliateToken() || false;
					var vendorId = _options.vendor || false;
					var linkId = _this.Affiliate.linkId() || false;
					var affiliateId = _this.Affiliate.affiliateId() || false;
					var sellerId = _this.Affiliate.sellerId() || false;
					
					if(!_this.Status.loadedAffiliateAnalytics) {
						_this.Affiliate.analyticsStart();
						
						paddleAffiliateAnalytics.user.identify(affiliateToken);						
						paddleAffiliateAnalytics.user.profile({
							Context: {
								AffiliateToken: affiliateToken,
								VendorId: vendorId,
								LinkId: linkId,
								AffiliateId: affiliateId,
								SellerId: sellerId
							},
							Campaign: {
								Campaign: _util.campaignAttributes().Campaign,
								Source: _util.campaignAttributes().Source,
								Medium: _util.campaignAttributes().Medium,
								Term: _util.campaignAttributes().Term,
								Referrer: _util.campaignAttributes().Referrer,
								ReferrerCategory: _util.campaignAttributes().ReferrerCategory
							},
							Attributes: {
								Mobile: _util.isMobile(),
								Browser: _util.analyticsContext().browser
							}
						});
					}
					
					if(affiliateToken) {
						paddleAffiliateAnalytics.action.track(event, {
							CheckoutID: typeof additionalAttributes != 'undefined' && typeof additionalAttributes.CheckoutID != 'undefined' ? additionalAttributes.CheckoutID : null,
							Request: {
								Domain: window.location.host.replace(/www\./, ''),
								Path: window.location.origin+window.location.pathname,
								Secure: (window.location.protocol == 'https') ? true : false,
							},
							
							// Values below are duplicated from profile() until that works in queries.
							Context: {
								AffiliateToken: affiliateToken,
								VendorId: vendorId,
								LinkId: linkId,
								AffiliateId: affiliateId,
								SellerId: sellerId
							},
							Campaign: {
								Campaign: _util.campaignAttributes().Campaign,
								Source: _util.campaignAttributes().Source,
								Medium: _util.campaignAttributes().Medium,
								Term: _util.campaignAttributes().Term,
								Referrer: _util.campaignAttributes().Referrer,
								ReferrerCategory: _util.campaignAttributes().ReferrerCategory
							},
							Attributes: {
								Mobile: _util.isMobile(),
								Browser: _util.analyticsContext().browser
							}
						});
						_this.Debug('Fired affiliate event: '+event);
					}
				} else {
					_this.Debug('Ignoring "'+event+'" as this isn\'t an affiliate visit.', 'warning');
				}
			},
			
			isAffiliate: function() {
				return _util.isAffiliate();
			},
			
			affiliateToken: function() {
				if(_util.isAffiliate()) {
					return _util.affiliateToken();
				} else {
					return false;
				}
			},
			
			linkId: function() {
				var campaignData = _util.campaignAttributes();
				return campaignData.AffiliateData.link;
			},
			
			affiliateId: function() {
				var campaignData = _util.campaignAttributes();
				return campaignData.AffiliateData.affiliate;
			},
			
			sellerId: function() {
				var campaignData = _util.campaignAttributes();
				return campaignData.AffiliateData.seller;
			}
			
		};
		
		// Analytics & tracking functions.
		this.Analytics = {
			start: function() {
				if(!_this.Status.failedLoadingAnalytics) {
					if(_options.enableTracking && !_this.Status.loadedAnalytics) {
						//_this.Debug('Starting analytics with key: '+_this.Environment.defaults().analyticsKey);
						
						(function (e, t) { if (!t.__SV) {
							var debug = '';
							
							// Send 10% of requests through Runscope, instead of direct.
							//if(Math.random(0,1) <= 0.10) {
							if(0 == 1) { // Turned off for now...
								debug = '-debug';
								window.AnalyticsDebug = true;
							} else {
								window.AnalyticsDebug = false;
							}
							
							window.paddleAnalytics = t; var n = e.createElement("script"); n.type = "text/javascript"; n.src = "http" + ("https:" === e.location.protocol ? "s" : "") + '://cdn.paddle.com/paddle/analytics'+debug+'.js'; n.async = !0; var r = e.getElementsByTagName("script")[0]; r.parentNode.insertBefore(n, r); t.init = function (e, o) { t.writeKey = e; t._initOptions = o; t._execQueue = []; m = "action.track action.trackSale action.trackHTMLLink action.setGlobalProperty user.profile user.identify user.clear".split(" "); for (var n = 0; n < m.length; n++) { var f = function () { var r = m[n]; var s = function () { t._execQueue.push({ m: r, args: arguments }) }; var i = r.split("."); if (i.length == 2) { if (!t[i[0]]) { t[i[0]] = [] } t[i[0]][i[1]] = s } else { t[r] = s } }(); } }; t.__SV = 1 } })(document, window.paddleAnalytics || []);
						
						try {
							paddleAnalytics.init(_this.Environment.defaults().analyticsKey, {
								cookieName: _defaults.analyticsCookie
							});
						} catch(error) {
							// This isn't great, as if paddleAnalytics throws an actual exception during an async activity on setup (which it does) we won't
							// be able to catch it as the async callback will be outside the scope of the try/catch.
							_this.Status.failedLoadingAnalytics = true;
							_this.Debug('Failed to start analytics with key: '+_this.Environment.defaults().analyticsKey, 'warning');
						}
												
						if(!_this.Status.failedLoadingAnalytics) {
							_this.Status.loadedAnalytics = true;
							_this.Debug('Analytics Started');
						}
					}
				} else {
					_this.Debug('Won\'t attempt to initiate analytics after previous failure in same session.', 'warning');
				}
			},
			
			track: function(action, eventParams, definedParams, blocking) {
				blocking = blocking != null ? blocking : false;
				
				if(_options.enableTracking) {
					if(!_this.Status.loadedAnalytics) {
						_this.Analytics.start();
					}
					
					if(_this.Status.loadedAnalytics && !_this.Status.failedLoadingAnalytics) {
						var action = (typeof action == 'undefined') ? null : action;
						var eventParams = (typeof eventParams == 'undefined') ? {} : eventParams;
						var definedParams = (typeof definedParams == 'undefined') ? {} : definedParams;
						
						// Add our default analytics params.
						var properties = _util.analyticsDefaults();
						properties._EventParams = eventParams;
						properties._DefinedParams = definedParams;					
						
						// Identify user (if data is set)
						// @note Currently for guest users (even when an account is created user.id is not being set). This should start picking up on those once it starts working.
						if(properties._EventParams && properties._EventParams.user && typeof properties._EventParams.user.id != 'undefined' && properties._EventParams.user.id != null) {
							paddleAnalytics.user.identify(properties._EventParams.user.id);
							paddleAnalytics.user.profile({
								"$full_name": properties._EventParams.user.email,
								"$email": properties._EventParams.user.email,
								"$country": (typeof properties._EventParams.user.country != 'undefined') ? properties._EventParams.user.country : null,
								"User.ID": properties._EventParams.user.id
							});							
						}
						
						// Remove 'created_at' from paddleAnalytics data.
						if(properties._EventParams && properties._EventParams.checkout && properties._EventParams.checkout.created_at) {
							delete properties._EventParams.checkout.created_at;
						}
						
						// Fire to paddleAnalytics's servers.	
						paddleAnalytics.action.track(action, properties, blocking);
						_this.Debug('Fired analytics action: '+action);
						
						// Fire event to Beacon...
						//try {
						//	if(typeof properties != 'undefined') {
						//		_util.jsonp('https://relay.getbeacon.io/server.php?action='+action+'&message='+JSON.stringify(properties), function(data) {
						//			// Do nothing...
						//		});
						//	}
						//} catch(err) { /* Ignore Errors */ }
					} else {
						_this.Debug('Unable to send '+action+' analytics action as we were previously unable to initiate the analytics library.', 'warning');
					}
				}
			},
			
			trackPageview: function() {
				if(_options.vendor != null) {
					_this.Debug('Vendor is identified, tracking pageviews...');
					
					var params = {};
					params["$view_url"] = document.URL.replace(/#.*$/, "");  // Strip anchor
					params["$view_name"] = document.title || "No Title";
					
					this.track('Website.PageView', params, false);
				} else {
					_this.Debug('Vendor not identified, skipping pageview tracking.');
				}
			}
		};
		
		// Conversations
		this.Conversation = {
			
			Create: function(email, subject, body) {				
				_util.post(_this.Environment.defaults().conversationCreateApi, 'vendor_id='+_options.vendor+'&email='+email+'&subject='+subject+'&body='+body+'&source=SDK', function(data) {
					console.log(data);
				});
			},
			
			CreatePopup: function(inputAttributes) {
				var popupInstance = '_'+Math.ceil(Math.random()*10000000);
				
				// Build 'attributes' object, wih default values, based on inputs passed to function.
				var attributes = {
					dismissColor: (typeof (inputAttributes || {}).dismissColor != 'undefined') ? inputAttributes.dismissColor : 'dark',
					strings: {
						heading: (typeof ((inputAttributes || {}).strings || {}).heading != 'undefined') ? inputAttributes.strings.heading : "Subscribe for updates!",
						subHeading: (typeof ((inputAttributes || {}).strings || {}).subHeading != 'undefined') ? inputAttributes.strings.subHeading : "Subscribe to our email newsletter, and stay updated with our latest products, developments and offers.",
						emailPlaceholder: (typeof ((inputAttributes || {}).strings || {}).emailPlaceholder != 'undefined') ? inputAttributes.strings.emailPlaceholder : "Email Address...",
						cta: (typeof ((inputAttributes || {}).strings || {}).cta != 'undefined') ? inputAttributes.strings.cta : "Subscribe!",
						successMessage: (typeof ((inputAttributes || {}).strings || {}).successMessage != 'undefined') ? inputAttributes.strings.successMessage : "Success! You are now subscribed!",
					},
					view: {
						animations: {
							show: (typeof (((inputAttributes || {}).view || {}).animations || {}).show != 'undefined') ? inputAttributes.view.animations.show : "bounceIn",
							hide: (typeof (((inputAttributes || {}).view || {}).animations || {}).hide != 'undefined') ? inputAttributes.view.animations.hide : "fadeOutUpBig"
						},
						styles: {
							heading: {
								textColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).heading || {}).textColor != 'undefined') ? inputAttributes.view.styles.heading.textColor : "#000000"
							},
							subHeading: {
								textColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).subHeading || {}).textColor != 'undefined') ? inputAttributes.view.styles.subHeading.textColor : "#666666"
							},
							popup: {
								backgroundColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup  || {}).backgroundColor != 'undefined') ? inputAttributes.view.styles.popup.backgroundColor : "#FFFFFF",
								backgroundImage: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundImage != 'undefined') ? inputAttributes.view.styles.popup.backgroundImage : false,
								backgroundSize: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundSize != 'undefined') ? inputAttributes.view.styles.popup.backgroundSize : false,
								backgroundPosition: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundPosition != 'undefined') ? inputAttributes.view.styles.popup.backgroundPosition : false,
								backgroundRepeat: (typeof ((((inputAttributes || {}).view || {}).styles || {}).popup || {}).backgroundRepeat != 'undefined') ? inputAttributes.view.styles.popup.backgroundRepeat : false
							},
							cta: {
								backgroundColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).cta || {}).backgroundColor != 'undefined') ? inputAttributes.view.styles.cta.backgroundColor : "#4CAF50",
								textColor: (typeof ((((inputAttributes || {}).view || {}).styles || {}).cta || {}).textColor != 'undefined') ? inputAttributes.view.styles.cta.textColor : "#FFFFFF"
							}
						}
					},
					callback: (typeof (inputAttributes || {}).callback != 'undefined') ? inputAttributes.callback : false
				};
				
				var popupHtml = '<div class="paddle-popup paddle-animated paddle-bounceIn">';
					popupHtml += '<div class="paddle-popup-close">';
						popupHtml += '<a class="paddle-popup-close-image" href="#!"><img src="https://cdn.paddle.com/paddle/assets/images/close-dark.png" border="0" /></a>';
					popupHtml += '</div>';
					popupHtml += '<div class="paddle-popup-inner" style="background-color: #FFFFFF;">';
						popupHtml += '<div class="paddle-popup-heading paddle-popup-text-center" style="color: #000000;">Get in Touch</div>';
						popupHtml += '<div class="paddle-popup-subheading paddle-popup-text-center" style="color: #666666;">We\'re looking forward to hearing from you!</div>';
						popupHtml += '<div class="paddle-popup-form">';
							popupHtml += '<input type="text" class="paddle-popup-field paddle-popup-field-space-bottom paddle-popup-email" placeholder="Your Email" />';
							popupHtml += '<input type="text" class="paddle-popup-field paddle-popup-field-space-bottom paddle-popup-subject" placeholder="Subject" />';
							popupHtml += '<textarea class="paddle-popup-field paddle-popup-textarea paddle-popup-message" placeholder="Your message..."></textarea>';
							popupHtml += '<input type="button" class="paddle-popup-cta" value="Send Message" style="color: #FFFFFF; background-color: #4CAF50;" />';
						popupHtml += '</div>';
					popupHtml += '</div>';
				popupHtml += '</div>';
				
				_util.ready(function() {
					var body = document.getElementsByTagName('body')[0];
					var contactPopup = document.createElement('div');
					contactPopup.setAttribute('class', 'paddle-reset paddle-popup-container paddle-popup-instance_'+popupInstance+' paddle-animated paddle-fadeIn paddle-hidden');
					contactPopup.innerHTML = popupHtml;
					body.appendChild(contactPopup);
					
					var close = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-close-image')[0];
					close.onclick = function(e) {
						e.preventDefault();
						_this.Popup.hide(popupInstance, 'conversation');
					};
					
					var submit = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-cta')[0];
					submit.onclick = function() {
						var conversationFields = {
							email: document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-email')[0].value || '',
							subject: document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-subject')[0].value || '',
							message: document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-message')[0].value || ''
						};
						
						// Create Conversation
						_this.Conversation.Create(conversationFields.email, conversationFields.subject, conversationFields.message);
						_this.Popup.hide(popupInstance, 'conversation');
						alert('Your message has been sent!');
					};
					
					var inputEmail = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-email')[0];
					inputEmail.onkeyup = function(e) {
						if(e.keyCode == 13) {
							e.preventDefault();
							
							// Create Conversation
							_this.Conversation.Create(conversationFields.email, conversationFields.subject, conversationFields.message);
							_this.Popup.hide(popupInstance, 'conversation');
							alert('Your message has been sent!');
						}
					};
					
					var inputSubject = document.getElementsByClassName('paddle-popup-instance_'+popupInstance)[0].getElementsByClassName('paddle-popup-subject')[0];
					inputSubject.onkeyup = function(e) {
						if(e.keyCode == 13) {
							e.preventDefault();
							
							// Create Conversation
							_this.Conversation.Create(conversationFields.email, conversationFields.subject, conversationFields.message);
							_this.Popup.hide(popupInstance, 'conversation');
							alert('Your message has been sent!');
						}
					};
					
					
					_this.Popup.show(popupInstance, 'Manual', 'conversation');
				});
				
				return popupInstance;
			}
			
		};
		
		// Utilities used by the library.
		var _util = {
			
			// nl2br (php) equivilant function.
			nl2br: function(str, is_xhtml) {
				var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
				return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
			},
			
			// Show element.
			show: function(element) {
				_util.removeClass(element, 'paddle-hidden');
				_util.addClass(element, 'paddle-visible');
			},
			
			// Hide element.
			hide: function(element) {
				_util.removeClass(element, 'paddle-visible');
				_util.addClass(element, 'paddle-hidden');
			},
			
			// Choose variant
			chooseCheckoutVariant: function() {
				var totalVariantWeight = 0;
				_checkoutVariants.forEach(function(variant) {
					totalVariantWeight += variant.weight;
				});
				
				var randomAssignment = Math.random()*totalVariantWeight;
				for(var i = 0, currentTotal = 0; i<_checkoutVariants.length; i++) {
					currentTotal += _checkoutVariants[i].weight;
					if(randomAssignment <= currentTotal) {
						return _checkoutVariants[i];
					}
				}
			},
			
			// Browser / OS Information
			analyticsContext: function() {
				var unknown = 'Unknown';
			
		        // screen
		        var screenSize = '';
		        if (screen.width) {
		            width = (screen.width) ? screen.width : '';
		            height = (screen.height) ? screen.height : '';
		            screenSize += '' + width + " x " + height;
		        }
		
		        //browser
		        var nVer = navigator.appVersion;
		        var nAgt = navigator.userAgent;
		        var browser = navigator.appName;
		        var version = '' + parseFloat(navigator.appVersion);
		        var majorVersion = parseInt(navigator.appVersion, 10);
		        var nameOffset, verOffset, ix;
		
		        // Opera
		        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
		            browser = 'Opera';
		            version = nAgt.substring(verOffset + 6);
		            if ((verOffset = nAgt.indexOf('Version')) != -1) {
		                version = nAgt.substring(verOffset + 8);
		            }
		        }
		        // MSIE
		        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
		            browser = 'Microsoft Internet Explorer';
		            version = nAgt.substring(verOffset + 5);
		        }
		
		        //IE 11 no longer identifies itself as MS IE, so trap it
		        //http://stackoverflow.com/questions/17907445/how-to-detect-ie11
		        else if ((browser == 'Netscape') && (nAgt.indexOf('Trident/') != -1)) {
		
		            browser = 'Microsoft Internet Explorer';
		            version = nAgt.substring(verOffset + 5);
		            if ((verOffset = nAgt.indexOf('rv:')) != -1) {
		                version = nAgt.substring(verOffset + 3);
		            }
		
		        }
		
		        // Chrome
		        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
		            browser = 'Chrome';
		            version = nAgt.substring(verOffset + 7);
		        }
		        // Safari
		        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
		            browser = 'Safari';
		            version = nAgt.substring(verOffset + 7);
		            if ((verOffset = nAgt.indexOf('Version')) != -1) {
		                version = nAgt.substring(verOffset + 8);
		            }
		
		            // Chrome on iPad identifies itself as Safari. Actual results do not match what Google claims
		            //  at: https://developers.google.com/chrome/mobile/docs/user-agent?hl=ja
		            //  No mention of chrome in the user agent string. However it does mention CriOS, which presumably
		            //  can be keyed on to detect it.
		            if (nAgt.indexOf('CriOS') != -1) {
		                //Chrome on iPad spoofing Safari...correct it.
		                browser = 'Chrome';
		                //Don't believe there is a way to grab the accurate version number, so leaving that for now.
		            }
		        }
		        // Firefox
		        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
		            browser = 'Firefox';
		            version = nAgt.substring(verOffset + 8);
		        }
		        // Other browsers
		        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
		            browser = unknown;
		            version = '0';
		        }
		        // trim the version string
		        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
		        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
		        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);
		
		        majorVersion = parseInt('' + version, 10);
		        if (isNaN(majorVersion)) {
		            version = '' + parseFloat(navigator.appVersion);
		            majorVersion = parseInt(navigator.appVersion, 10);
		        }
		
		        // mobile version
		        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);
		
		        // cookie
		        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
		
		        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
		            document.cookie = 'testcookie';
		            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
		        }
		
		        // system
		        var os = unknown;
		        var clientStrings = [
		            {s:'Windows 3.11', r:/Win16/},
		            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
		            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
		            {s:'Windows 98', r:/(Windows 98|Win98)/},
		            {s:'Windows CE', r:/Windows CE/},
		            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
		            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
		            {s:'Windows Server 2003', r:/Windows NT 5.2/},
		            {s:'Windows Vista', r:/Windows NT 6.0/},
		            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
		            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
		            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
		            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
		            {s:'Windows ME', r:/Windows ME/},
		            {s:'Android', r:/Android/},
		            {s:'Open BSD', r:/OpenBSD/},
		            {s:'Sun OS', r:/SunOS/},
		            {s:'Linux', r:/(Linux|X11)/},
		            {s:'iOS', r:/(iPhone|iPad|iPod)/},
		            {s:'Mac OS X', r:/Mac OS X/},
		            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
		            {s:'QNX', r:/QNX/},
		            {s:'UNIX', r:/UNIX/},
		            {s:'BeOS', r:/BeOS/},
		            {s:'OS/2', r:/OS\/2/},
		            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
		        ];
		        for (var id in clientStrings) {
		            var cs = clientStrings[id];
		            if (cs.r.test(nAgt)) {
		                os = cs.s;
		                break;
		            }
		        }
		
		        var osVersion = unknown;
		
		        if (/Windows/.test(os)) {
		            osVersion = /Windows (.*)/.exec(os)[1];
		            os = 'Windows';
		        }
		
		        switch (os) {
		            case 'Mac OS X':
		                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
		                break;
						
		            case 'Android':
		                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
		                break;
						
		            case 'iOS':
		                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
		                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
		                break;
						
		        }
		        
		        // os version numbers replace dots with underscores on some operating systems, change them back.
		        osVersion = osVersion.replace(/_/g, ".");
			
			    var browserDetail = {
			        screen: screenSize,
			        browser: browser,
			        browserVersion: version,
			        mobile: mobile,
			        os: os,
			        osVersion: osVersion,
			        cookies: cookieEnabled
			    };
			    
			    return browserDetail;
			},
			
			// Global event handler
			fireEvent: function(eventData) {				
				if(typeof _options.eventCallback == 'function') {
					_options.eventCallback(eventData);
				}
			},
			
			// Auto-open the checkout if paddle_open=true is set
			detectAutoOpen: function() {
				if(typeof _util.urlParam('paddle_open') != 'undefined' && (_util.urlParam('paddle_open') == 'true' || _util.urlParam('paddle_open') === true)) {
					_util.ready(function() {
						var firstButton = (typeof document.getElementsByClassName('paddle_button')[0] != 'undefined') ? document.getElementsByClassName('paddle_button')[0] : false;
						
						if(firstButton) {
							var buttonAttributes = _this.Button.getButtonAttributes(firstButton);
							_this.Checkout.open(buttonAttributes, 'auto-open');
						}
					});
				}
			},
			
			// Auto-apply coupon if paddle_coupon=X
			getUrlCoupon: function() {
				if(typeof _util.urlParam('paddle_coupon') != 'undefined' && _util.urlParam('paddle_coupon') != '') {
					return _util.urlParam('paddle_coupon');
				} else {
					return false;
				}
			},
			
			// Calls the checkout public pricing API to get the currency price of the product for the current user.
			getPrices: function(productId, quantity, callback) {
				if(typeof _prices[productId] == 'undefined') {
					_util.jsonp(_this.Environment.defaults().pricesApi+'?product_id='+productId+'&quantity='+quantity, function(data) {
						_prices[productId] = {};
						_prices[productId] = data;
						
						if(typeof callback == 'function') {
							callback(_prices[productId]);
						}
					});
				} else {
					if(typeof callback == 'function') {
						callback(_prices[productId]);
					}
				}				
			},
			
			// Listen for messages from the checkout			
			listen: function() {
				window.addEventListener("message", (function(message) {
					/*
					if(_options.sdk) {
						_this.Debug('SDK Post Message Output: '+JSON.stringify(message)+' / '+JSON.stringify(message.data));
					}
					*/
					
					if(typeof message.data == 'object') {
						if(typeof message.data.callback_data == 'undefined') {
							var callback_data = {};
						} else {
							var callback_data = message.data.callback_data;
						}
						
						if(message.data.action == 'close') {
							_util.closeCheckout(callback_data);
						} else if(message.data.action == 'complete') {
							_util.completeCheckout(callback_data);
						}
						
						if(message.data.action == 'event' || message.data.action == 'close' || message.data.action == 'complete') {
							// Fire gloabl event to vendor (if subscribed)
							if(message.data.action == 'event') {
								if(message.data.event_name != 'Checkout.Ping.Size') {
									var globalEventData = {
										event: message.data.event_name,
										eventData: callback_data,
										checkoutData: _activeCheckout,
										campaignData: _util.analyticsDefaults()
									};
									_util.fireEvent(globalEventData);
								}
							} else {
								if(message.data.action == 'close') {
									var eventName = 'Checkout.Close';
								} else if(message.data.action == 'complete') {
									var eventName = 'Checkout.Complete';
								}
								
								var globalEventData = {
									event: eventName,
									eventData: callback_data,
									checkoutData: _activeCheckout,
									campaignData: _util.analyticsDefaults()
								};
								_util.fireEvent(globalEventData);
							}
						}
						
						if(message.data.action == 'event') {
							// Map the events we expect from the checkout to avoid noise from other postMessage firers that might be calling their message "event"
							// Also allows us to map data to analytics properties.
							if(message && message.data && message.data.event_name) {
								_this.Debug('Checkout fired message: '+message.data.event_name);
								
								if(message.data.event_name == 'Checkout.Loaded') {
									if(_activeCheckout.method != 'inline') {
										// Once loaded, we show the paddle 'powered by' badge.
										_util.showPoweredBy();
										
										// Remote checkout has fired a 'Loaded' event. We can close any loading spinners.
										_util.hideLoading();
										
										// Display Upsell **Beta**
										// @note Only open the upsell if this isn't an upsell button click.
										if((typeof _activeCheckout.isUpsell == 'undefined' || _activeCheckout.isUpsell != 'true') && _activeCheckout.upsell) {
											_this.Upsell.display(_activeCheckout.upsell);
										}
									}
									
									_this.Analytics.track('Paddle.Checkout.Loaded', callback_data, {});
									
									// Fire the 'loadCallback' if it's set.
									if(typeof window[_activeCheckout.loadCallback] == 'function') {
										window[_activeCheckout.loadCallback]();
									} else if(typeof _activeCheckout.loadCallback == 'function') {
										_activeCheckout.loadCallback();
									}
								} else if(message.data.event_name == 'Checkout.Error') {
									_this.Analytics.track('Paddle.Checkout.Error', callback_data, {
										'Error.Message': message.data.callback_data.message
									});
								} else if(message.data.event_name == 'Checkout.Ping.Size') {
									// The checkout sends us it's height every second or so, use it to update the height of the on-page iframe
									// if this is an 'inline' checkout.
									if(message.data.callback_data && message.data.callback_data.height != '') {
										if(typeof _activeCheckout.frameTarget != '') {
											var newFrameHeight = parseInt(message.data.callback_data.height)+45;
											document.getElementsByClassName(_activeCheckout.frameTarget)[0].getElementsByTagName('iframe')[0].setAttribute('height', newFrameHeight);
										}
									}
								} else if(message.data.event_name == 'Checkout.PaymentComplete') {
									_this.Analytics.track('Paddle.Checkout.PaymentComplete', callback_data, {});
								} else if(message.data.event_name == 'Checkout.CountryInformationEntered') {
									_this.Analytics.track('Paddle.Checkout.CountryInformationEntered', callback_data, {});
								} else if(message.data.event_name == 'Checkout.Login') {
									_this.Analytics.track('Paddle.Checkout.Login', callback_data, {});
								} else if(message.data.event_name == 'Checkout.PaymentMethodSelected') {
									_this.Analytics.track('Paddle.Checkout.PaymentMethodSelected', callback_data, {
										'PaymentMethod': message.data.callback_data.paymentMethod
									});
								} else if(message.data.event_name == 'Checkout.DuplicateWarningShown') {
									_this.Analytics.track('Paddle.Checkout.DuplicateWarningShown', callback_data, {});
								}
							}
						}
					}
				}), false);
			},
			
			// Show a Loading Spinner
			showLoading: function(returnHtml) {
				_util.hideLoading();
				
				if(typeof returnHtml == 'undefined') {
					var returnHtml = false;
				}
				
				var paddleLoader = document.createElement('div');
				paddleLoader.setAttribute('style', 'z-index:99998; display: block; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: 0px; padding: 0px; background: rgba(0,0,0,0.38);');
				paddleLoader.className = 'paddle-loader';
				
				var loadingCircle = document.createElement('div');
				loadingCircle.setAttribute('style', 'z-index: 99999; display: block; width: 58px; height: 58px; position: fixed; top: 50%; left: 50%; margin-top: -29px; margin-left: -29px; background: #FFFFFF; box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.1), 0px 1px 6px 0px rgba(0,0,0,0.12); border-radius: 40px; padding: 4px; box-sizing: border-box;');
				
				var loadingImage = document.createElement('img')
				loadingImage.src = 'https://cdn.paddle.com/paddle/assets/images/loading.gif';
				loadingImage.setAttribute('style', 'display: block; width: 50px; height: 50px;');
				
				loadingCircle.appendChild(loadingImage);
				paddleLoader.appendChild(loadingCircle);
				
				if(!returnHtml) {
					document.getElementsByTagName('body')[0].appendChild(paddleLoader);
				} else {
					return _util.nodeToString(paddleLoader);
				}
			},
			
			// Hide any active Loading Spinners
			hideLoading: function() {
				_util.each('paddle-loader', function(loader) {
					loader.parentNode.removeChild(loader);
				});
			},
			
			// Shows 'powered by paddle' badge.
			showPoweredBy: function() {
				if(_options.poweredByBadge && !_util.isMobile() && !_options.sdk) {
					// Remove any existing 'powered by' badges, if they exist.
					_util.hidePoweredBy();
					
					// Build the powered by element
					var paddlePowered = document.createElement('div');
					paddlePowered.className = 'paddle-powered';
					paddlePowered.setAttribute('style', 'position: fixed; z-index: 99999999; left: 12px; bottom: 12px;');
					
					var poweredLink = document.createElement('a');
					poweredLink.setAttribute('href', 'https://www.paddle.com/features?utm_source=Referral_'+window.location.host+'&utm_campaign=CheckoutReferral&utm_medium=CheckoutReferral&utm_content=Referral_'+window.location.host);
					poweredLink.setAttribute('target', '_blank');
					
					var poweredImage = document.createElement('img');
					poweredImage.setAttribute('src', 'https://cdn.paddle.com/paddle/assets/images/powered.png');
					poweredImage.setAttribute('width', 220);
					poweredImage.setAttribute('height', 32);
					poweredImage.setAttribute('style', 'width:220px;height:32px;');
					
					poweredLink.appendChild(poweredImage);
					
					// Send some analytics data on click.
					poweredLink.addEventListener("click", function(event) {
						_this.Analytics.track('Paddle.PoweredBy.Click', {}, {});
					});
					
					paddlePowered.appendChild(poweredLink);
					document.getElementsByTagName('body')[0].appendChild(paddlePowered);
					
					// Send some analytics data to track that we've shown the powered by.
					_this.Analytics.track('Paddle.PoweredBy.Impression', {}, {});
				} else {
					if(_util.isMobile()) {
						_this.Debug('"Powered by Paddle" rendering skipped due to mobile session.');
					} else {
						_this.Debug('"Powered by Paddle" rendering skipped due to _options preference.');
					}
				}
			},
			
			// Hides 'powered by paddle' badge.
			hidePoweredBy: function() {
				_util.each('paddle-powered', function(loader) {
					loader.parentNode.removeChild(loader);
				});
			},
			
			// Detects if the visiting user is on a mobile device.
			isMobile: function() {
				var check = false;
				(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
				
				return check;
			},
			
			// Our equivilant of jQuery's $(document).ready()
			ready: (function(){    
			    var readyList,
			        DOMContentLoaded,
			        class2type = {};
			        class2type["[object Boolean]"] = "boolean";
			        class2type["[object Number]"] = "number";
			        class2type["[object String]"] = "string";
			        class2type["[object Function]"] = "function";
			        class2type["[object Array]"] = "array";
			        class2type["[object Date]"] = "date";
			        class2type["[object RegExp]"] = "regexp";
			        class2type["[object Object]"] = "object";
			
			    var ReadyObj = {
			        // Is the DOM ready to be used? Set to true once it occurs.
			        isReady: false,
			        // A counter to track how many items to wait for before
			        // the ready event fires. See #6781
			        readyWait: 1,
			        // Hold (or release) the ready event
			        holdReady: function( hold ) {
			            if ( hold ) {
			                ReadyObj.readyWait++;
			            } else {
			                ReadyObj.ready( true );
			            }
			        },
			        // Handle when the DOM is ready
			        ready: function( wait ) {
			            // Either a released hold or an DOMready/load event and not yet ready
			            if ( (wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady) ) {
			                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			                if ( !document.body ) {
			                    return setTimeout( ReadyObj.ready, 1 );
			                }
			
			                // Remember that the DOM is ready
			                ReadyObj.isReady = true;
			                // If a normal DOM Ready event fired, decrement, and wait if need be
			                if ( wait !== true && --ReadyObj.readyWait > 0 ) {
			                    return;
			                }
			                // If there are functions bound, to execute
			                readyList.resolveWith( document, [ ReadyObj ] );
			
			                // Trigger any bound ready events
			                //if ( ReadyObj.fn.trigger ) {
			                //  ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
			                //}
			            }
			        },
			        bindReady: function() {
			            if ( readyList ) {
			                return;
			            }
			            readyList = ReadyObj._Deferred();
			
			            // Catch cases where $(document).ready() is called after the
			            // browser event has already occurred.
			            if ( document.readyState === "complete" ) {
			                // Handle it asynchronously to allow scripts the opportunity to delay ready
			                return setTimeout( ReadyObj.ready, 1 );
			            }
			
			            // Mozilla, Opera and webkit nightlies currently support this event
			            if ( document.addEventListener ) {
			                // Use the handy event callback
			                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			                // A fallback to window.onload, that will always work
			                window.addEventListener( "load", ReadyObj.ready, false );
			
			            // If IE event model is used
			            } else if ( document.attachEvent ) {
			                // ensure firing before onload,
			                // maybe late but safe also for iframes
			                document.attachEvent( "onreadystatechange", DOMContentLoaded );
			
			                // A fallback to window.onload, that will always work
			                window.attachEvent( "onload", ReadyObj.ready );
			
			                // If IE and not a frame
			                // continually check to see if the document is ready
			                var toplevel = false;
			
			                try {
			                    toplevel = window.frameElement == null;
			                } catch(e) {}
			
			                if ( document.documentElement.doScroll && toplevel ) {
			                    doScrollCheck();
			                }
			            }
			        },
			        _Deferred: function() {
			            var // callbacks list
			                callbacks = [],
			                // stored [ context , args ]
			                fired,
			                // to avoid firing when already doing so
			                firing,
			                // flag to know if the deferred has been cancelled
			                cancelled,
			                // the deferred itself
			                deferred  = {
			
			                    // done( f1, f2, ...)
			                    done: function() {
			                        if ( !cancelled ) {
			                            var args = arguments,
			                                i,
			                                length,
			                                elem,
			                                type,
			                                _fired;
			                            if ( fired ) {
			                                _fired = fired;
			                                fired = 0;
			                            }
			                            for ( i = 0, length = args.length; i < length; i++ ) {
			                                elem = args[ i ];
			                                type = ReadyObj.type( elem );
			                                if ( type === "array" ) {
			                                    deferred.done.apply( deferred, elem );
			                                } else if ( type === "function" ) {
			                                    callbacks.push( elem );
			                                }
			                            }
			                            if ( _fired ) {
			                                deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
			                            }
			                        }
			                        return this;
			                    },
			
			                    // resolve with given context and args
			                    resolveWith: function( context, args ) {
			                        if ( !cancelled && !fired && !firing ) {
			                            // make sure args are available (#8421)
			                            args = args || [];
			                            firing = 1;
			                            try {
			                                while( callbacks[ 0 ] ) {
			                                    callbacks.shift().apply( context, args );//shifts a callback, and applies it to document
			                                }
			                            }
			                            finally {
			                                fired = [ context, args ];
			                                firing = 0;
			                            }
			                        }
			                        return this;
			                    },
			
			                    // resolve with this as context and given arguments
			                    resolve: function() {
			                        deferred.resolveWith( this, arguments );
			                        return this;
			                    },
			
			                    // Has this deferred been resolved?
			                    isResolved: function() {
			                        return !!( firing || fired );
			                    },
			
			                    // Cancel
			                    cancel: function() {
			                        cancelled = 1;
			                        callbacks = [];
			                        return this;
			                    }
			                };
			
			            return deferred;
			        },
			        type: function( obj ) {
			            return obj == null ?
			                String( obj ) :
			                class2type[ Object.prototype.toString.call(obj) ] || "object";
			        }
			    }
			    // The DOM ready check for Internet Explorer
			    function doScrollCheck() {
			        if ( ReadyObj.isReady ) {
			            return;
			        }
			
			        try {
			            // If IE is used, use the trick by Diego Perini
			            // http://javascript.nwbox.com/IEContentLoaded/
			            document.documentElement.doScroll("left");
			        } catch(e) {
			            setTimeout( doScrollCheck, 1 );
			            return;
			        }
			
			        // and execute any waiting functions
			        ReadyObj.ready();
			    }
			    // Cleanup functions for the document ready method
			    if ( document.addEventListener ) {
			        DOMContentLoaded = function() {
			            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			            ReadyObj.ready();
			        };
			
			    } else if ( document.attachEvent ) {
			        DOMContentLoaded = function() {
			            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			            if ( document.readyState === "complete" ) {
			                document.detachEvent( "onreadystatechange", DOMContentLoaded );
			                ReadyObj.ready();
			            }
			        };
			    }
			    function ready( fn ) {
			        // Attach the listeners
			        ReadyObj.bindReady();
			
			        var type = ReadyObj.type( fn );
			
			        // Add the callback
			        readyList.done( fn );//readyList is result of _Deferred()
			    }
			    return ready;
			})(),
			
			// Our equivilant of jQuery's $('.abc').each()
			each: function(className, callback) {
				var elements = document.getElementsByClassName(className); // a live nodeList
								
				for(var i = 0; i < elements.length; i++) {
					var thisElement = elements[i];
					
					if(typeof callback === "function") {
						callback(thisElement);
					} else {
						throw new Error("_util.each(className, function() {... requires the callback argument to be of type Function");
					}
					
					// Might need to reverse the order in which we loop through, unsure. See:
					// http://stackoverflow.com/questions/15843581/how-to-corectly-iterate-through-getelementsbyclassname
				}
			},
			
			queryString: function(obj, prefix) {
				var str = [];
				for(var p in obj) {
					if(obj.hasOwnProperty(p)) {
						var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
						if(k != null && k != '' && v != null && v != '' && typeof v != 'function') {
							// Remove some Checkout URL specific parameters we don't wish to pass
							if(k != 'closeCallback' && k != 'successCallback' && k != 'loadCallback' && k != 'method' && k != 'override') {
								str.push(typeof v == "object" ?
									this.queryString(v, k) :
									encodeURIComponent(k) + "=" + encodeURIComponent(v));
							}
						}
					}
				}
				
				return str.join("&");
			},
			
			buildCheckoutUrl: function(productId, checkoutQuery, type) {
				if(typeof checkoutQuery == 'undefined') {
					var checkoutQuery = {};
				}

				checkoutQuery.apple_pay_enabled = _util.isApplePaySupported() ? 'true' : 'false';
				
				// We should append/ decide popup status even if developer is overriding the URL.
				if(type == 'popup') {
					checkoutQuery.popup = 'true';
					checkoutQuery.paddle_js = 'true';
					checkoutQuery.is_popup = 'true'; // @note Hosted Update/Cancel URLs appear to be the only thing that use this parameter name.
					
					checkoutQuery.parentURL = window.location.href; // @old
					checkoutQuery.parent_url = window.location.href; // @new 1070
				} else {
					delete checkoutQuery.popup;
					
					if(type == 'fallback') {
						// Fallback checkouts are both 'popup' and 'popup_window' as we still want popup characteristics, like postMessage and close buttons.
						checkoutQuery.popup = 'true';
						checkoutQuery.paddle_js = 'true';
						checkoutQuery.popup_window = 'true';
						checkoutQuery.is_popup = 'true'; // @note Hosted Update/Cancel URLs appear to be the only thing that use this parameter name.
						
						if(_options.sdk) {
							checkoutQuery.display_mode = 'sdk';
						}
						
						checkoutQuery.parentURL = window.location.href; // @old
						checkoutQuery.parent_url = window.location.href; // @new 1070
					}
				}
				
				// If coupon is applied in URL apply it on checkout open.
				var urlCoupon = _util.getUrlCoupon();
				if(urlCoupon) {
					checkoutQuery.coupon = urlCoupon;
				}
				
				// Handle 'Paddle Internal' Checkouts (Used for Paddle Tools etc...)
				if(checkoutQuery.internal == 'true') {
					var internalPlan = checkoutQuery.plan;
					var internalVendor = checkoutQuery.vendor;
					
					// Remove the 'Paddle Internal' variables so they don't get appended to the query string.
					delete checkoutQuery.internal;
					delete checkoutQuery.plan;
					delete checkoutQuery.vendor;
					
					var checkoutFullUrl = _this.Environment.defaults().internalCheckoutBase+internalPlan+'/'+internalVendor+'/?'+_util.queryString(checkoutQuery);
				} else {
					// Check if this is an affiliate checkout, if so handle it differently.
					// Only use the affiliate checkout URL if vendor isn't using an override checkout.
					if(_util.isAffiliate() && (typeof checkoutQuery.override == 'undefined' || checkoutQuery.override.length == 0)) {
						// Buffer the checkout URL through the affiliate system.
						var checkoutFullUrl = 'https://a.paddle.com/checkout/'+_util.affiliateToken()+'/?type=product&product_id='+productId+'&'+_util.queryString(checkoutQuery);
						
						// Add an additional item for the 'data-success' parameter for affiliate checkouts
						if(typeof checkoutQuery.success != 'undefined' && checkoutQuery.success != '') {
							checkoutQuery.affiliate_success = _util.absoluteUrl(checkoutQuery.success);
						}
					} else {
						// Check if developer is passing in an 'override' checkout URL
						if(typeof checkoutQuery.override != 'undefined' && checkoutQuery.override != '' && checkoutQuery.override != null) {
							// If they are passing override, we use that...
							if(checkoutQuery.override.indexOf('?') <= -1) {
								var overrideGlue = '/?';
							} else {
								var overrideGlue = '&';
							}
							
							var checkoutFullUrl = checkoutQuery.override+overrideGlue+_util.queryString(checkoutQuery);
						} else {
							// If not passing override, we build a checkout URL based on the default Base URL.
							var checkoutFullUrl = _this.Environment.defaults().checkoutBase+productId+'/?'+_util.queryString(checkoutQuery);
						}
					}
				}
				
				_this.Debug('Built checkout URL: '+checkoutFullUrl);
				return checkoutFullUrl;
			},
			
			renderCheckoutFrame: function(productId, checkoutQuery, inline) {
				if(typeof inline == 'undefined') {
					var inline = false;
				}
				
				if(_options.sdk) {
					var checkoutUrl = _util.buildCheckoutUrl(productId, checkoutQuery, 'fallback');
				} else {
					var checkoutUrl = _util.buildCheckoutUrl(productId, checkoutQuery, 'popup');
				}
				
				// Show loading spinner while frame is loading.
				if(!inline) {
					_util.showLoading();
				}
				
				window.PaddleFrame = document.createElement('iframe');
				window.PaddleFrame.id = 'pf_'+productId;
				window.PaddleFrame.className = 'paddle-frame';
				window.PaddleFrame.frameborder = '0';
				window.PaddleFrame.allowtransparency = 'true';
				
				if(typeof checkoutQuery.frameStyle != 'undefined' && checkoutQuery.frameStyle != '') {
					window.PaddleFrame.setAttribute('style', checkoutQuery.frameStyle);
				} else {
					if(!_util.isMobile()) {
						window.PaddleFrame.setAttribute('style', 'z-index: 99999; display: block; background-color: transparent; border: 0px none transparent; overflow-x: hidden; overflow-y: auto; visibility: visible; margin: 0px; padding: 0px; -webkit-tap-highlight-color: transparent; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%;');
					} else {
						window.PaddleFrame.setAttribute('style', 'z-index: 99999; display: block; background-color: transparent; border: 0px none transparent; overflow-x: hidden; overflow-y: scroll; visibility: visible; margin: 0px; padding: 0px; -webkit-tap-highlight-color: transparent; position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;');
					}
				}
				
				if(typeof checkoutQuery.frameInitialHeight != 'undefined') {
					window.PaddleFrame.setAttribute('height', checkoutQuery.frameInitialHeight);
				}
				
				window.PaddleFrame.src = checkoutUrl;
				
				// Freeze viewport to frame on mobile.
				if(_util.isMobile() && (typeof _activeCheckout.method == 'undefined' || _activeCheckout.method != 'inline')) {
					window.mobileViewportControl.freeze(1.0, 'pf_'+productId);
				}
				
				if(typeof checkoutQuery.frameTarget != 'undefined' && checkoutQuery.frameTarget != '') {
					document.getElementsByClassName(checkoutQuery.frameTarget)[0].appendChild(window.PaddleFrame);
				} else {
					document.getElementsByTagName('body')[0].appendChild(window.PaddleFrame);
				}
			},
			
			renderCheckoutWindow: function(productId, checkoutQuery) {
				if(typeof window.PaddleWindow != 'undefined' && !window.PaddleWindow.closed) {
					_util.closeCheckout(null);
				}
				
				delete window.PaddleWindow;
				
				window.PaddleWindow = window.open("", 'PaddlePopupWindow', 'width='+_defaults.popupWindow.width+',height='+_defaults.popupWindow.height+',location='+_defaults.popupWindow.location+',menubar='+_defaults.popupWindow.menubar+',resizable='+_defaults.popupWindow.resizable+',scrollbars='+_defaults.popupWindow.scrollbars+',status='+_defaults.popupWindow.status+',toolbar='+_defaults.popupWindow.toolbar+',top='+_util.popupWindowPosition('top', _defaults.popupWindow.width, _defaults.popupWindow.height)+',left='+_util.popupWindowPosition('left', _defaults.popupWindow.width, _defaults.popupWindow.height), false);
				
				// check window is opened?
				if(typeof window.PaddleWindow != 'undefined') {
					window.PaddleWindow.document.write('<title>Loading Checkout...</title>'+_util.showLoading(true));
					window.PaddleWindow.location.href = _util.buildCheckoutUrl(productId, checkoutQuery, 'fallback');
					window.PaddleWindow.focus();
					_util.checkPopupWindowClosed('PaddleWindow', true);
					_this.Debug('Successfully opened Paddle Checkout as a popup window.');
				} else {
					// window hasn't opened, go normally
					_this.Analytics.track('Paddle.Checkout.Open.Failed', {}, {
						'Error.FailureType': 'window',
						'Error.Message': 'Failed to open checkout popup window, falling back to opening in current window.'
					});
					_this.Debug('Unable to load Paddle Checkout as a popup window (typically due to popup blocker), falling back to opening in the current page. Callbacks will not be called upon close and success.', 'warning');
					window.location.href = _util.buildCheckoutUrl(productId, checkoutQuery, 'normal');
				}
			},
			
			popupWindowPosition: function(direction, popupWidth, popupHeight) {
				var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
			    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
			
			    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
			    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
			
			    var left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft;
			    var top = ((height / 2) - (popupHeight / 2)) + dualScreenTop;
			    
			    if(direction == 'left') {
				    return left;
			    } else if(direction == 'top') {
				    return top;
			    } else {
				    return false;
			    }
			},
			
			closeCheckout: function(callback_data, fireCustomCallback, fireAnalytics) {
				var fireAnalytics = (typeof fireAnalytics != 'undefined') ? fireAnalytics : true;
				
				_this.Debug('Checkout frame/window has been closed.');
				
				// *BETA* Close the checkout upsell widget, if it exists.
				if(typeof _activeCheckout.upsell != 'undefined' && _activeCheckout.upsell != '') {
					_this.Upsell.close(_activeCheckout.upsell);
				}
				
				// *BETA* Hide the upsell 'original' button if it exists.
				var original = document.getElementById('paddle_upsell_original');
				if(original) {
					original.setAttribute('style', 'display:none;');
				}
				
				if(typeof fireCustomCallback == 'undefined') {
					var fireCustomCallback = true;
				}
				
				// Make sure any checkout visible elements are hidden.
				_util.hideLoading();
				_util.hidePoweredBy();
				
				// kill frame
				_util.each('paddle-frame', function(element) {
					element.parentNode.removeChild(element);
				});
				
				// close popup
				if(typeof window.PaddleWindow != 'undefined' && !window.PaddleWindow.closed) {
					_util.clearPopupWindowClosureCheck();
					window.PaddleWindow.close();
				}
				
				// This has been overwritten now that `callback_data` returns all of the required information.
				var closeObject = callback_data;
					
				if(fireAnalytics) {
					_this.Analytics.track('Paddle.Checkout.Close', closeObject, {});
				}
				
				// Fire any developer-defined close callbacks
				if(fireCustomCallback) {
					if(typeof window[_activeCheckout.closeCallback] == 'function') {
						delete closeObject.checkoutCompleted;
						window[_activeCheckout.closeCallback](closeObject);
					} else if(typeof _activeCheckout.closeCallback == 'function') {
						delete closeObject.checkoutCompleted;
						_activeCheckout.closeCallback(closeObject);
					}
				}
				
				// If viewport is frozen, unfreeze.
				if(_util.isMobile() && (typeof _activeCheckout.method == 'undefined' || _activeCheckout.method != 'inline')) {
					window.mobileViewportControl.thaw();
				}
			},
			
			completeCheckout: function(callback_data) {
				// This has been overwritten now that `callback_data` returns all of the required information.
				var completeObject = callback_data;
				
				_this.Analytics.track('Paddle.Checkout.Complete', completeObject, {});
				
				// If this is an affiliate, fire a conversion and kill cookie.
				if(_this.Affiliate.isAffiliate()) {
					_this.Affiliate.Event('Conversion', {CheckoutID: completeObject.checkout.id});
					_this.Affiliate.EndSession();
				}
				
				// Fire any developer-defined callbacks
				// Currently we disable the redirect if a developer defined callback is set, we pass the redirect info to their callback, so they can perform it if needed.
				if(typeof window[_activeCheckout.successCallback] == 'function') {
					_util.closeCheckout(null, false, true);
					
					delete completeObject.checkoutCompleted;
					window[_activeCheckout.successCallback](completeObject);
				} else if(typeof _activeCheckout.successCallback == 'function') {
					_util.closeCheckout(null, false, true);
					
					delete completeObject.checkoutCompleted;
					_activeCheckout.successCallback(completeObject);
				} else {
					// Redirect if the complete callback tells us to...
					if(_activeCheckout.success && _activeCheckout.success != '') {
						// Check if 'data-success' is specified in the original request, this redirect takes precident over the one returned from the checkout.
						// Close the checkout if it's open
						_util.closeCheckout(null, false, true);
						
						// Show the loader while the redirect is happening.
						_util.showLoading();
						
						// Redirect the user to the return_url, give it ~2 seconds for the tracking calls to complete.
						setTimeout(function() {
							window.top.location.href = _activeCheckout.success || '#!';
						}, 2100);
					} else if(callback_data && typeof callback_data.checkout != 'undefined' && callback_data.checkout.redirect_url != 'undefined' && callback_data.checkout.redirect_url != null) {
						// Close the checkout if it's open
						_util.closeCheckout(null);
						
						// Show the loader while the redirect is happening.
						_util.showLoading();
						
						// Redirect the user to the return_url, give it ~1.5 seconds for the tracking calls to complete.
						setTimeout(function() {
							window.top.location.href = callback_data.checkout.redirect_url || '#!';
						}, 2100);
					} else {
						// @note Previously the order details popup was automatic, it was breaking on some peoples checkouts, so now vendors have to 'enable' it.
						if(_options.completeDetails) {
							_util.closeCheckout(null);
							_this.Analytics.track('Paddle.Checkout.Complete.AutomaticDetailsPopup', completeObject, {});
							_this.Order.DetailsPopup(completeObject.checkout.id, '<div class="paddle-details-popup-interim-title">Success! Your transaction has been completed!</div><div class="paddle-details-popup-interim-message">Your order is now being processed and this page will update when processing is complete, an order confirmation email and receipt will be sent to the email address used during purchase.</div><div class="paddle-details-popup-interim-message-small">You can close this page at any time, processing will continue in the background and your order confirmation will be emailed to you.</div>');
						} else {
							_this.Analytics.track('Paddle.Checkout.Complete.NoAction', completeObject, {});
						}
					}
				}
			},
			
			checkPopupWindowClosed: function(popupWindow, newWindow) {
				if(typeof newWindow == 'undefined') {
					var newWindow = false;
				} else {
					if(newWindow) {
						window.clearInterval(window.PaddleCheckWindowClosure);
						delete window.PaddleCheckWindowClosure;
					}
				}
				
				if(typeof window[popupWindow] != 'undefined' && window[popupWindow].closed) {
					_util.clearPopupWindowClosureCheck();
					_util.closeCheckout(null);
				} else {
					if(typeof window[popupWindow] != 'undefined' && typeof window.PaddleCheckWindowClosure == 'undefined') {
						window.PaddleCheckWindowClosure = window.setInterval(function() {
							_util.checkPopupWindowClosed(popupWindow);
						}, 500);
					}
				}
			},
			
			clearPopupWindowClosureCheck: function() {
				if(typeof window.PaddleCheckWindowClosure != 'undefined') {
					window.clearInterval(window.PaddleCheckWindowClosure);
				}
			},
			
			hasClass: function(el, className) {
				if(el.classList) {
					return el.classList.contains(className);
				} else {
					return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
				}
			},

			addClass: function(el, className) {
				if(el.classList) {
					el.classList.add(className);
				} else if(!this.hasClass(el, className)) {
					el.className += " " + className;
				}
			},

			removeClass: function(el, className) {
				if(el.classList) {
					el.classList.remove(className);
				} else if(this.hasClass(el, className)) {
					var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
					el.className = el.className.replace(reg, ' ');
				}
			},
			
			// Converts a javascript element node (eg. HTMLDivElement to its HTML string equivilant);
			nodeToString: function(node) {
				var tmpNode = document.createElement("div");
				tmpNode.appendChild(node.cloneNode(true));
				
				var str = tmpNode.innerHTML;
				tmpNode = node = null; // prevent memory leaks in IE
				
				return str;
			},
			
			urlParam: function(param) {
			    var vars = {};
				var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
					vars[key] = value;
				});
				
				// We split any return value at the first #, as this indicates the start of a URL fragment, not query string.
				return vars[param] ? vars[param].split('#')[0] : '';
			},
			
			setCookie: function(cookieName, cookieValue, expiresDays) {
				if(expiresDays === -1) {
					var expires = 'Thu, 01 Jan 1970 00:00:01 GMT';
				} else {
					var date = new Date();
					date.setTime(date.getTime()+(expiresDays*24*60*60*1000));
					var expires = "expires="+date.toUTCString();
				}
				
				if(expiresDays != null) {
					document.cookie = cookieName+"="+cookieValue+"; path=/; "+expires;
				} else {
					document.cookie = cookieName+"="+cookieValue+"; path=/;";
				}
				
				return true;
			},
			
			getCookie: function(cookieName) {
				var name = cookieName + "=";
				var ca = document.cookie.split(';');
				for(var i=0; i<ca.length; i++) {
					var c = ca[i];
					while(c.charAt(0)==' ') c = c.substring(1);
					if(c.indexOf(name) == 0) return c.substring(name.length,c.length);
				}
				return "";
			},
			
			removeCookie: function(cookieName) {
				_util.setCookie(cookieName, '', -1);
			},
			
			// Converts a relative, or absolute URL (eg. /success/ or http://mysite.com/success/) into a full URL (eg. http://mysite.com/success/)
			absoluteUrl: function(path) {
			    var link = document.createElement("a");
				link.href = path;
				return link.protocol+"//"+link.host+link.pathname+link.search+link.hash;
			},
			
			// Categorises a referring domain, eg: t.co = Twitter + social
			campaignDomainCategory: function(domain) {
				var categorizedDomain = {};
				
				if(domain != '') {
					if(typeof _defaults.domainCategories[domain] == 'undefined') {
						// No Match, Try Parital Match
						var domainMatched = false;
						for(var domainMatch in _defaults.domainCategories) {
							if(!domainMatched) { // Stop after the first match.
						        if(domain.indexOf(domainMatch) >= 0) {
							        categorizedDomain = {
										type: _defaults.domainCategories[domainMatch].type,
										name: _defaults.domainCategories[domainMatch].name
									};
									
									domainMatched = true;
						        }
						    }
					    }
					    
					    if(!domainMatched) {
						    categorizedDomain = false;
					    }
					} else {
						// Exact Category <> Domain Match
						categorizedDomain = {
							type: _defaults.domainCategories[domain].type,
							name: _defaults.domainCategories[domain].name
						};
					}
				} else {
					categorizedDomain = false;
				}
				
				return categorizedDomain;
			},
			
			// Grabs URL campaign attributes, stores as cookies and defaults to sensible values, returns object representing the entire campaign.
			campaignAttributes: function() {
				var returnCampaign = {};
				
				// Affiliates
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'affiliate') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'affiliate') != '') {
					returnCampaign.Affiliate = true;
					returnCampaign.AffiliateData = JSON.parse(_util.getCookie(_defaults.campaignCookiePrefix+'affiliate'));
				} else {
					if(typeof _util.urlParam('p_tok') != 'undefined' && _util.urlParam('p_tok') != '') {
						returnCampaign.Affiliate = true;
						returnCampaign.AffiliateData = {
							token: _util.urlParam('p_tok'),
							link: _util.urlParam('p_link'),
							affiliate: _util.urlParam('p_aid'),
							seller: _util.urlParam('p_sid')
						};
						
						_util.setCookie(_defaults.campaignCookiePrefix+'affiliate', JSON.stringify(returnCampaign.AffiliateData), _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.Affiliate = false;
						returnCampaign.AffiliateData = {
							token: false,
							link: false,
							affiliate: false,
							seller: false
						};
					}
				}
				
				// Discovery
				// Note: Discovery is inacted via affiliate, however we send a p_discovery=true parameter, to enable tracking here.
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'discovery') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'discovery') != '') {
					returnCampaign.Discovery = true;
				} else {
					if(typeof _util.urlParam('p_discovery') != 'undefined' && _util.urlParam('p_discovery') == 'true') {
						returnCampaign.Discovery = true;
						_util.setCookie(_defaults.campaignCookiePrefix+'discovery', 'true', _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.Discovery = false;
					}
				}
				
				// paddle_ref
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'paddle_ref') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'paddle_ref') != '') {
					returnCampaign.PaddleRef = _util.getCookie(_defaults.campaignCookiePrefix+'paddle_ref');
				} else {
					if(typeof _util.urlParam('paddle_ref') != 'undefined' && _util.urlParam('paddle_ref') != '') {
						returnCampaign.PaddleRef = _util.urlParam('paddle_ref');
						_util.setCookie(_defaults.campaignCookiePrefix+'paddle_ref', returnCampaign.PaddleRef, _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.PaddleRef = false;
					}
				}
				
				// utm_campaign
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'campaign') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'campaign') != '') {
					returnCampaign.Campaign = _util.getCookie(_defaults.campaignCookiePrefix+'campaign');
				} else {
					if(typeof _util.urlParam('utm_campaign') != 'undefined' && _util.urlParam('utm_campaign') != '') {
						returnCampaign.Campaign = _util.urlParam('utm_campaign');
						_util.setCookie(_defaults.campaignCookiePrefix+'campaign', returnCampaign.Campaign, _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.Campaign = false;
					}
				}
				
				// utm_source
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'source') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'source') != '') {
					returnCampaign.Source = _util.getCookie(_defaults.campaignCookiePrefix+'source');
				} else {
					if(typeof _util.urlParam('utm_source') != 'undefined' && _util.urlParam('utm_source') != '') {
						returnCampaign.Source = _util.urlParam('utm_campaign');
						_util.setCookie(_defaults.campaignCookiePrefix+'source', returnCampaign.Source, _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.Source = false;
					}
				}
				
				// utm_medium
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'medium') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'medium') != '') {
					returnCampaign.Medium = _util.getCookie(_defaults.campaignCookiePrefix+'medium');
				} else {
					if(typeof _util.urlParam('utm_medium') != 'undefined' && _util.urlParam('utm_medium') != '') {
						returnCampaign.Medium = _util.urlParam('utm_medium');
						_util.setCookie(_defaults.campaignCookiePrefix+'medium', returnCampaign.Medium, _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.Medium = false;
					}
				}
				
				// utm_term
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'term') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'term') != '') {
					returnCampaign.Term = _util.getCookie(_defaults.campaignCookiePrefix+'term');
				} else {
					if(typeof _util.urlParam('utm_term') != 'undefined' && _util.urlParam('utm_term') != '') {
						returnCampaign.Term = _util.urlParam('utm_term');
						_util.setCookie(_defaults.campaignCookiePrefix+'term', returnCampaign.Term, _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.Term = false;
					}
				}
				
				// referring domain
				if(typeof _util.getCookie(_defaults.campaignCookiePrefix+'referrer') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix+'referrer') != '') {
					returnCampaign.Referrer = _util.getCookie(_defaults.campaignCookiePrefix+'referrer');
				} else {
					if(typeof document.referrer.split('/')[2] != 'undefined' && document.referrer.split('/')[2] != '') {
						returnCampaign.Referrer = document.referrer.split('/')[2];
						_util.setCookie(_defaults.campaignCookiePrefix+'referrer', returnCampaign.Referrer, _defaults.campaignCookieExpiresDays);
					} else {
						returnCampaign.Referrer = false;
					}
				}
				
				// referring domain categorisation
				if(returnCampaign.Referrer) {
					var referrerMeta = _util.campaignDomainCategory(returnCampaign.Referrer);
					if(referrerMeta) {
						returnCampaign.Referrer = referrerMeta.name;
						returnCampaign.ReferrerCategory = referrerMeta.type;
					} else {
						returnCampaign.ReferrerCategory = false;
					}
				} else {
					returnCampaign.ReferrerCategory = false;
				}
				
				return returnCampaign;
			},
			
			// Default analytics events to be sent with every request.
			analyticsDefaults: function() {
				var analyticsDefaultValues = {};
				analyticsDefaultValues._Library = {};
				analyticsDefaultValues._Request = {};
				analyticsDefaultValues._Affiliate = {};
				analyticsDefaultValues._Discovery = {};
				analyticsDefaultValues._Campaign = {};
				analyticsDefaultValues._Campaign.Referrer = {};
				analyticsDefaultValues._SDK = {};
				analyticsDefaultValues._Tests = {};
				
				// Optimization/Test Data
				analyticsDefaultValues._Tests = {
					Checkout: _options.checkoutVariant
				};
				
				// Library Defaults
				analyticsDefaultValues._Library.Version = libraryVersion;
				analyticsDefaultValues._Library.LoadMethod = _options.loadMethod;
				
				// Vendor Defaults
				analyticsDefaultValues._Vendor = _options.vendor || null;
				
				// Request Defaults
				analyticsDefaultValues._Request.Secure = (window.location.protocol == 'https') ? true : false;
				analyticsDefaultValues._Request.Domain = (_options.sdk && _options.sdkAttributes && _options.sdkAttributes.bundleIdentifier) ? _options.sdkAttributes.bundleIdentifier : window.location.host.replace(/www\./, '');
				analyticsDefaultValues._Request.Page = window.location.origin+window.location.pathname;
				analyticsDefaultValues._Request.Mobile = _util.isMobile();
				analyticsDefaultValues._Request.Browser = (_options.sdk) ? 'SDK' : _util.analyticsContext().browser || 'Unknown';
				analyticsDefaultValues._Request.Platform = (_options.sdk) ? 'SDK' : (_util.isMobile()) ? 'Mobile' : 'Web';
				analyticsDefaultValues._Request.ApplePaySupported = _util.isApplePaySupported();
				
				// SDK Values
				if(_options.sdk) {
					analyticsDefaultValues._SDK = _options.sdkAttributes || {};
				}
								
				// Campaign/Referrer Defaults
				var campaignData = _util.campaignAttributes();
				
				analyticsDefaultValues._Campaign.Referrer.Name = (campaignData.Referrer) ? campaignData.Referrer : null;
				analyticsDefaultValues._Campaign.Referrer.Type = (campaignData.ReferrerCategory) ? campaignData.ReferrerCategory : null;
				analyticsDefaultValues._Campaign.Paddle = (campaignData.PaddleRef) ? campaignData.PaddleRef : null;
				analyticsDefaultValues._Campaign.Name = (campaignData.Campaign) ? campaignData.Campaign : null;
				analyticsDefaultValues._Campaign.Source = (_options.sdk) ? 'SDK' : (campaignData.Source) ? campaignData.Source : null;
				analyticsDefaultValues._Campaign.Medium = (campaignData.Medium) ? campaignData.Medium : null;
				analyticsDefaultValues._Campaign.Term = (campaignData.Term) ? campaignData.Term : null;
				
				// Affiliate Info
				analyticsDefaultValues._Affiliate.IsAffiliate = (campaignData.Affiliate) ? true : false;
				analyticsDefaultValues._Affiliate.AffiliateToken = (campaignData.AffiliateData.token) ? campaignData.AffiliateData.token : null;
				
				// Discovery Info
				analyticsDefaultValues._Discovery.IsDiscovery = (campaignData.Discovery) ? true : false;
				
				// Build a sanitised CampaignSummaryString based on the above values.
				// Format: <checkoutDomain> / <discovery/affiliate> / <referrer> / <paddleCampaign> / <campaign>
				// @todo Make this pass a campaign/referrer object to the checkout instead of a string once we've added parsing for it Paddle-side.
				analyticsDefaultValues._Campaign.CampaignSummaryString = '';
				
				if(analyticsDefaultValues._Request.Domain != null) {
					if(analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
					analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Request.Domain.replace('/', '');
				}
				
				if(analyticsDefaultValues._Discovery.IsDiscovery) {
					if(analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
					analyticsDefaultValues._Campaign.CampaignSummaryString += 'Paddle Discovery';
				} else {
					if(analyticsDefaultValues._Affiliate.IsAffiliate) {
						if(analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
						analyticsDefaultValues._Campaign.CampaignSummaryString += 'Affiliate';
					}
				}
				
				if(analyticsDefaultValues._Campaign.Referrer.Name != null) {
					if(analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
					analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Campaign.Referrer.Name.replace('/', '');
				}
				
				if(analyticsDefaultValues._Campaign.Paddle != null) {
					if(analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';					
					analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Campaign.Paddle.replace('/', '');
				}
				
				if(analyticsDefaultValues._Campaign.Name != null) {
					if(analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
					analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Campaign.Name.replace('/', '');
				}
				
				// Override the 'Campaign Summary String' for SDK checkouts.
				if(_options.sdk) {
					analyticsDefaultValues._Campaign.CampaignSummaryString = _options.sdkAttributes.appName+' In-app Purchase (SDK)';
				}
				
				return analyticsDefaultValues;
			},
			
			setPaddleCampaign: function(campaignValue) {
				if(campaignValue != null && campaignValue != '') {
					_util.setCookie(_defaults.campaignCookiePrefix+'paddle_ref', campaignValue, _defaults.campaignCookieExpiresDays);
				}
			},
			
			buildPaddleReferrerString: function() {
				var analyticsData = _util.analyticsDefaults();
				return analyticsData._Campaign.CampaignSummaryString || '';
			},
			
			isAffiliate: function() {
				if(_util.getCookie(_defaults.campaignCookiePrefix+'affiliate_ignore') != _util.affiliateToken() && _util.affiliateToken()) {
					var analyticsData = _util.analyticsDefaults();
					return analyticsData._Affiliate.IsAffiliate;
				} else {
					return false;
				}
			},
			
			affiliateToken: function() {
				var campaignData = _util.campaignAttributes();
				
				if(campaignData.AffiliateData.token != _util.getCookie(_defaults.campaignCookiePrefix+'affiliate_ignore')) {
					return campaignData.AffiliateData.token;
				} else {
					return false;
				}
			},
			
			jsonp: function(url, callback, context) {
				var name = "_jsonp_" + Math.ceil(Math.random()*10000000);
				if(url.match(/\?/)) {
					url += "&callback="+name;
				} else {
					url += "?callback="+name;
				}
				
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = url;
				
				window[name] = function(data) {
					_this.Debug('Paddle API call finished ('+url+'), response: '+JSON.stringify(data));
					callback.call((context || window), data);
					document.getElementsByTagName('head')[0].removeChild(script);
					script = null;
					delete window[name];
				};
				
				document.getElementsByTagName('head')[0].appendChild(script);
			},
			
			post: function(url, parameterString, callback) {
				var http = new XMLHttpRequest();
				http.open("POST", url, true);
				http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

				http.onreadystatechange = function() {
					if(http.readyState == 4 && http.status == 200) {
						if(typeof callback == 'function') {
							callback(http.responseText);
						}
					}
				}
				
				http.send(parameterString);
			},

			isApplePaySupported: function () {
				// Check if the current browser has ApplePay enabled
				var applePaySession = window.ApplePaySession;
				var isSupported;

				try {
					isSupported = applePaySession && applePaySession.canMakePayments();
				} catch(e) {
					isSupported = false;
				}

				return !!isSupported;
			}
			
		};
		
		// Debug/Log message handling.
		this.Debug = function(message, type, alwaysShow) {
			
			// Shim console for unsupported browsers.
			window.console = console || {
					log: function(message) { },
					error: function(message) { },
					warn: function(message) { }
				};
			window.console.debug = window.console.debug || window.console.log || function() { };
			
			if(typeof type == 'undefined') {
				var type = 'log';
			}
			
			if(typeof alwaysShow == 'undefined') {
				var alwaysShow = false;
			}
			
			var debugMessage = '[Paddle Debug] '+message;
			if(_options.debug) {
				if(type == 'log') {
					console.debug(debugMessage);
				} else if(type == 'warning') {
					console.warn(debugMessage);
				}
			}
			
			if(alwaysShow) {
				console.warn(message);
			}
		};
	}
	
})();

(function() {
	var Paddle;
	var PaddleVersion = "1.9.15"; // Increment this upon new Paddle.js version.
	
	if(this.Paddle == null || typeof this.Paddle == 'undefined') {
		this.Paddle || (this.Paddle = {});
		this.Paddle = new _Paddle(window, PaddleVersion);
	}
})(this);

// Prototype Polyfills
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(callback, thisArg) {
		
		var T, k;
		
		if (this === null) {
		  throw new TypeError(' this is null or not defined');
		}
		
		// 1. Let O be the result of calling toObject() passing the
		// |this| value as the argument.
		var O = Object(this);
		
		// 2. Let lenValue be the result of calling the Get() internal
		// method of O with the argument "length".
		// 3. Let len be toUint32(lenValue).
		var len = O.length >>> 0;
		
		// 4. If isCallable(callback) is false, throw a TypeError exception. 
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== "function") {
		  throw new TypeError(callback + ' is not a function');
		}
		
		// 5. If thisArg was supplied, let T be thisArg; else let
		// T be undefined.
		if (arguments.length > 1) {
		  T = thisArg;
		}
		
		// 6. Let k be 0
		k = 0;
		
		// 7. Repeat, while k < len
		while (k < len) {
		
		  var kValue;
		
		  // a. Let Pk be ToString(k).
		  //    This is implicit for LHS operands of the in operator
		  // b. Let kPresent be the result of calling the HasProperty
		  //    internal method of O with argument Pk.
		  //    This step can be combined with c
		  // c. If kPresent is true, then
		  if (k in O) {
		
		    // i. Let kValue be the result of calling the Get internal
		    // method of O with argument Pk.
		    kValue = O[k];
		
		    // ii. Call the Call internal method of callback with T as
		    // the this value and argument list containing kValue, k, and O.
		    callback.call(T, kValue, k, O);
		  }
		  // d. Increase k by 1.
		  k++;
		}
		
	};
}

// Mobile Viewport Fix
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('mobile-viewport-control', [], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.mobileViewportControl = factory();
  }
}(this, function() {

//---------------------------------------------------------------------------
// Getting/Setting Scroll position
//---------------------------------------------------------------------------

function getScroll() {
  return {
    top: window.pageYOffset || document.documentElement.scrollTop,
    left: window.pageXOffset || document.documentElement.scrollLeft
  };
}

function setScroll(scroll) {
  if (window.scrollTo) {
    window.scrollTo(scroll.left, scroll.top);
  } else {
    document.documentElement.scrollTop = scroll.top;
    document.documentElement.scrollLeft = scroll.left;
    document.body.scrollTop = scroll.top;
    document.body.scrollLeft = scroll.left;
  }
}

//---------------------------------------------------------------------------
// Getting Initial Viewport from <meta name='viewport'> tags
// but we also include implicit defaults.
//---------------------------------------------------------------------------

function getInitialViewport(withDefaults) {
  var viewport = {};

  if (withDefaults) {
    // These seem to be the defaults
    viewport = {
      'user-scalable': 'yes',
      'minimum-scale': '0',
      'maximum-scale': '10'
    };
  }

  var tags = document.querySelectorAll('meta[name=viewport]');
  var i,j,tag,content,keyvals,keyval;
  for (i=0; i<tags.length; i++) {
    tag = tags[i];
    content = tag.getAttribute('content');
    if (tag.id !== hookID && content) {
      keyvals = content.split(',');
      for (j=0; j<keyvals.length; j++) {
        keyval = keyvals[j].split('=');
        if (keyval.length === 2) {
          viewport[keyval[0].trim()] = keyval[1].trim();
        }
      }
    }
  }
  return viewport;
}

function getPrettyInitialViewport() {
  var initial = getInitialViewport();
  var keyvals = [];
  for (var prop in initial) {
    if (initial.hasOwnProperty(prop)) {
      keyvals.push({key:prop, val:initial[prop]});
    }
  }
  return (
    keyvals.sort(function(a,b) {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    }).map(function(kv) {
      return kv.key + '=' + kv.val;
    }).join(',\n')
  );
}

//---------------------------------------------------------------------------
// Calculating current viewport scale
// simplified from: http://menacingcloud.com/?c=viewportScale
//---------------------------------------------------------------------------

function getOrientation() {
  var degrees = window.orientation;
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  if(degrees === undefined) {
    return (w > h) ? 'landscape' : 'portrait';
  }
  return (degrees % 180 === 0) ? 'portrait' : 'landscape';
}

function getOrientedScreenWidth() {
  var orientation = getOrientation();
  var sw = screen.width;
  var sh = screen.height;
  return (orientation === 'portrait') ? Math.min(sw,sh) : Math.max(sw,sh);
}

function getScale() {
  var visualViewportWidth = window.innerWidth;
  var screenWidth = getOrientedScreenWidth();
  return screenWidth / visualViewportWidth;
}


//---------------------------------------------------------------------------
// Get mobile OS
// from: http://stackoverflow.com/a/21742107
//---------------------------------------------------------------------------

function getMobileOS() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (userAgent.match(/iPad/i) ||
      userAgent.match(/iPhone/i) ||
      userAgent.match(/iPod/i)) {
    return 'iOS';
  }
  else if (userAgent.match(/Android/i)) {
    return 'Android';
  }
}

function isFirefox() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return userAgent.match(/Firefox/i) ? true : false;
}

//---------------------------------------------------------------------------
// State and Constants
//---------------------------------------------------------------------------

// A unique ID of the meta-viewport tag we must create
// to hook into and control the viewport.
var hookID = '__mobileViewportControl_hook__';

// A unique ID of the CSS style tag we must create to
// add rules for hiding the body.
var styleID = '__mobileViewPortControl_style__';

// An empirical guess for the maximum time that we have to
// wait before we are confident a viewport change has registered.
var refreshDelay = 200;

// Original viewport state before freezing.
var originalScale;
var originalScroll;

// Classes we use to make our css selector specific enough
// to hopefully override all other selectors.
// (mvc__ = mobileViewportControl prefix for uniqueness)
var hiddenClasses = [
  'mvc__a',
  'mvc__lot',
  'mvc__of',
  'mvc__classes',
  'mvc__to',
  'mvc__increase',
  'mvc__the',
  'mvc__odds',
  'mvc__of',
  'mvc__winning',
  'mvc__specificity'
];

//---------------------------------------------------------------------------
// Isolating an Element
//---------------------------------------------------------------------------

function isolatedStyle(elementID) {
  var classes = hiddenClasses.join('.');
  return [
    // We effectively clear the <html> and <body> background
    // and sizing attributes.
    'html.' + classes + ',',
    'html.' + classes + ' > body {',
    '  background: #fff;',
    '  width: auto;',
    '  min-width: inherit;',
    '  max-width: inherit;',
    '  height: auto;',
    '  min-height: 100%;', // Was 'inherit', now '100%' (by @involer)
    '  max-height: inherit;',
    '  margin: 0;',
    '  padding: 0;',
    '  border: 0;',
    '}',
    // hide everything in the body...
    'html.' + classes + ' > body > * {',
    '  display: none !important;',
    '}',
    // ...except the given element ID
    'html.' + classes + ' > body > #' + elementID + ' {',
    '  display: block !important;',
    '}'
  ].join('\n');
}

function isolate(elementID) {
  // add classes to body tag to isolate all other elements
  var classes = hiddenClasses.join(' ');
  var html = document.documentElement;
  html.className += ' ' + classes;

  // add isolating style rules
  var style = document.createElement('style');
  style.id = styleID;
  style.type = 'text/css';
  style.appendChild(document.createTextNode(isolatedStyle(elementID)));
  document.head.appendChild(style);
}

function undoIsolate() {
  // remove isolating classes from body tag
  var classes = hiddenClasses.join(' ');
  var html = document.documentElement;
  html.className = html.className.replace(classes, '');

  // remove isolating style rules
  var style = document.getElementById(styleID);
  document.head.removeChild(style);
}

//---------------------------------------------------------------------------
// Freezing
//---------------------------------------------------------------------------

// Freeze the viewport to a given scale.
function freeze(scale) {
  // optional arguments
  var isolateID, onDone;

  // get optional arguments using their type
  var args = Array.prototype.slice.call(arguments, 1);
  if (typeof args[0] === 'string') {
    isolateID = args[0];
    args.splice(0, 1);
  }
  if (typeof args[0] === 'function') {
    onDone = args[0];
  }

  // save original viewport state
  originalScroll = getScroll();
  originalScale = getScale();

  // isolate element if needed
  if (isolateID) {
    isolate(isolateID);
    setScroll({x:0,y:0});
  }

  // validate scale
  // (we cannot freeze scale at 1.0 on Android)
  if (scale === 1) {
    scale = 1.002;
  }

  // add our new meta viewport tag
  var hook = document.getElementById(hookID);
  if (!hook) {
    hook = document.createElement('meta');
    hook.id = hookID;
    hook.name = 'viewport';
    document.head.appendChild(hook);
  }

  // When freezing the viewport, we still enable
  // user-scalability and allow a tight zooming
  // margin.  Without this, UIWebView would simply
  // ignore attempts to set the scale.  But with this
  // solution, the next time the user pinch-zooms
  // in this state, the viewport will auto-snap
  // to our scale.

  var includeWidth = (getMobileOS() === 'Android' && isFirefox());
  hook.setAttribute('content', [
    'user-scalable=yes',
    'initial-scale='+scale,
    'minimum-scale='+scale,
    'maximum-scale='+(scale+0.004),
    (includeWidth ? 'width=device-width' : null)
  ].filter(Boolean).join(','));

  if (onDone) {
    setTimeout(onDone, refreshDelay);
  }
}

//---------------------------------------------------------------------------
// Thawing
//---------------------------------------------------------------------------

function thawWebkit(hook, initial, onDone) {
  // Restore the user's manual zoom.
  hook.setAttribute('content', [
    'initial-scale='+originalScale,
    'minimum-scale='+originalScale,
    'maximum-scale='+originalScale
  ].join(','));

  // Restore the page's zoom bounds.
  hook.setAttribute('content', [
    'user-scalable='+initial['user-scalable'],
    'minimum-scale='+initial['minimum-scale'],
    'maximum-scale='+initial['maximum-scale'],
    (initial.width ? 'width='+initial.width : null)
  ].filter(Boolean).join(','));

  // Remove our meta viewport hook.
  document.head.removeChild(hook);

  setScroll(originalScroll);

  setTimeout(function() {
    if (onDone)
      onDone();
  }, refreshDelay);
}

function thawGecko(hook, initial, onDone) {
  // Restore the user's manual zoom.
  hook.setAttribute('content', [
    'initial-scale='+originalScale,
    'minimum-scale='+originalScale,
    'maximum-scale='+originalScale
  ].join(','));

  // Updating the scroll here is too early,
  // but it's used to force a refresh of the viewport
  // with our current desired scale.
  setScroll(originalScroll);

  setTimeout(function(){
    // Restore the page's zoom bounds.
    hook.setAttribute('content', [
      'user-scalable='+initial['user-scalable'],
      'minimum-scale='+initial['minimum-scale'],
      'maximum-scale='+initial['maximum-scale'],
      (initial.width ? 'width='+initial.width : null)
    ].filter(Boolean).join(','));

    // Restore the scroll again now that the scale is correct.
    setScroll(originalScroll);

    // Remove our meta viewport hook.
    document.head.removeChild(hook);

    if (onDone)
      onDone();
  }, refreshDelay);
}

function thawBlink(hook, initial, onDone) {
  hook.setAttribute('content', [
    'user-scalable='+initial['user-scalable'],
    // WebView does not support this:
    //'initial-scale='+originalScale
    'initial-scale='+initial['initial-scale'],
    'minimum-scale='+initial['minimum-scale'],
    'maximum-scale='+initial['maximum-scale'],
    (initial.width ? 'width='+initial.width : null)
  ].filter(Boolean).join(','));

  setScroll(originalScroll);

  setTimeout(function(){
    document.head.removeChild(hook);
    if (onDone)
      onDone();
  }, refreshDelay);
}

// Thaw the viewport, restoring the scale and scroll to what it
// was before freezing.
function thaw(onDone) {
  // restore body visibility
  var style = document.getElementById(styleID);
  if (style) {
    undoIsolate();
  }

  // exit if there is nothing to thaw
  var hook = document.getElementById(hookID);
  if (!hook) {
    return;
  }

  var initial = getInitialViewport(true);

  // thaw function defaults to webkit
  var thawFunc = thawWebkit;
  var os = getMobileOS();
  if (os === 'Android')  { thawFunc = isFirefox() ? thawGecko : thawBlink; }
  else if (os === 'iOS') { thawFunc = thawWebkit; }

  // call appropriate thaw function
  thawFunc(hook, initial, onDone);
}

//---------------------------------------------------------------------------
// Public API
//---------------------------------------------------------------------------

return {
  getInitialViewport: getInitialViewport,
  getPrettyInitialViewport: getPrettyInitialViewport,
  getScale: getScale,
  isolate: isolate,
  undoIsolate: undoIsolate,

  // stable
  version: '0.3.1',
  freeze: freeze,
  thaw: thaw
};

})); // end module scope
