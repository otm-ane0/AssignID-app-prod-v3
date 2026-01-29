(() => {
    
        if (
            document.getElementsByClassName(
                'faqnation-floating-widget-container'
            )[0]
        ) {
            return;
        }
        let widgetContainer = () => {
            //const faqnationApiBase = 'http://localhost:3000';
            const faqnationApiBase = 'https://faqnation.com';
            let options = {};
            const pageScriptElms = document.getElementsByTagName('script');
            for (let i = 0; i < pageScriptElms.length; i++) {
                let script = pageScriptElms[i];
                if (
                    script.getAttribute('data-src') ===
                    `${faqnationApiBase}/embed/floating-button.js`
                ) {
                    options['data-project'] =
                        script.getAttribute('data-project');
                    options['data-user'] = script.getAttribute('data-user');
                    options['data-id'] = script.getAttribute('data-id');
                    options['data-limit'] =
                        script.getAttribute('data-limit') || undefined;
                    options['data-hidesearch'] =
                        script.getAttribute('data-hidesearch') || undefined;
                    options['data-hidetopics'] =
                        script.getAttribute('data-hidetopics') || undefined;
                    options['data-hidesendquestion'] =
                        script.getAttribute('data-hidesendquestion') ||
                        undefined;
                    break;
                }
            }
            let widgetVisibility = false;
            function setWidgetVisibility(arg) {
                if (typeof arg === typeof (() => {})) {
                    widgetVisibility = arg(widgetVisibility);
                } else {
                    widgetVisibility = arg;
                }
                if (widgetVisibility) {
                    widgetContentContainer.classList.add('widget-visible');
                    if (widgetContentContainer.children.length === 0) {
                        let contentContainer = document.createElement('div');
                        contentContainer.setAttribute(
                            'class',
                            'faqnation-floating-widget-content-container'
                        );
                        let script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        let attributesList = Object.keys(options);
                        for (let i = 0; i < attributesList.length; i++) {
                            if (options[attributesList[i]] !== undefined) {
                                script.setAttribute(
                                    attributesList[i],
                                    options[attributesList[i]]
                                );
                            }
                        }
                        script.src = 'https://faqnation.com/embed/faq.js';
                        contentContainer.appendChild(script);
                        widgetContentContainer.append(contentContainer);
                    }
                } else {
                    widgetContentContainer.classList.remove('widget-visible');
                }
            }
            let styles = `
            .faqnation-floating-widget-container{
                display: inline-block;
                position: fixed;
                bottom: 20px;
                right: 20px;
                overflow: visible;
                z-index: 999999999;
            }
            .faqnation-floating-widget-content{
                box-sizing: border-box;
                position: absolute;
                bottom: calc(100% + 10px);
                width: calc(100vw - 20px);
                height: calc(100vh - 130px);
                height: calc(100svh - 80px);
                max-width: 360px;
                max-height: 560px;
                background: #fff;
                padding: 0 10px 20px;
                right: -10px;
                border-radius: 12px;
                overflow: auto;
                box-shadow: 0px 4px 12px rgba(0,0,0,.08);
                border: 1px solid rgba(0,0,0,.07);
                scrollbar-width: thin;
                display: none;
            }
            .faqnation-floating-widget-content::before{
                content: '';
                display: block;
                width: 20px;
                height: 20px;
                position: absolute;
                top: 20px;
                left: 50%;
                margin: 0 auto;
                border: 3px solid rgba(150,150,150,.15);
                border-top-color: transparent;
                border-left-color: transparent;
                border-radius: 50%;
                animation: .6s 0s linear infinite faqnationfloatingwidgetcontentloading;
            }
            @keyframes faqnationfloatingwidgetcontentloading{
                0%{
                    transform: translateX(-50%) rotate(0deg);
                }
                100%{
                    transform: translateX(-50%) rotate(360deg);
                }
            }
            .faqnation-floating-widget-content.widget-visible{
                display: block;
            }
            .faqnation-floating-widget-content-container{
                background: inherit;
                position: relative;
            }
            .faqnation-floating-widget-toggle-btn{
                width: 42px;
                height: 42px;
                border-radius: 50%;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                overflow: visible;
                cursor: pointer;
            }
            .faqnation-floating-widget-toggle-btn,
            .faqnation-floating-widget-toggle-btn:focus,
            .faqnation-floating-widget-toggle-btn:active{
                border: none;
                outline: none;
                box-shadow: none;
                background: transparent;
            }
            .faqnation-floating-widget-toggle-btn>svg{
                width: 40px;
                height: auto;
                flex-shrink: 0;
                flex-grow: 0;
            }
        `;
            let container = document.createElement('div');
            container.setAttribute(
                'class',
                `faqnation-floating-widget-container`
            );
            container.innerHTML = `<style>${styles}</style>`;
            let widgetContentContainer = widgetContent(() => {
                setWidgetVisibility(false);
            });
            container.appendChild(widgetContentContainer);
            container.appendChild(
                floatingButton({ setWidgetVisibility: setWidgetVisibility })
            );
            return container;
        };
        let widgetContent = ({ hideWidget = () => {} }) => {
            let content = document.createElement('div');
            content.setAttribute('class', 'faqnation-floating-widget-content');
            return content;
        };
        let floatingButton = ({ setWidgetVisibility = () => {} }) => {
            let buttonIcon = `<svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.8189 5.47203L12.9307 2.14844L20.1008 2.61565L26.1633 8.0365L27.9704 13.1663L26.8629 20.045L21.9662 27.0985L17.361 29.9549V26.7487L12.2895 26.1658L8.67529 25.0582L4.65303 20.9194L2.6123 16.8971V12.7583L5.8189 5.47203Z" fill="white"/><path d="M15.9111 33.5638L15.4945 28.5638H15.0778C11.1334 28.5638 7.78613 27.1888 5.03613 24.4388C2.28613 21.6888 0.911133 18.3416 0.911133 14.3971C0.911133 10.4527 2.28613 7.10547 5.03613 4.35547C7.78613 1.60547 11.1334 0.230469 15.0778 0.230469C17.05 0.230469 18.8903 0.598524 20.5986 1.33464C22.307 2.07075 23.807 3.08464 25.0986 4.3763C26.3903 5.66797 27.4042 7.16797 28.1403 8.8763C28.8764 10.5846 29.2445 12.4249 29.2445 14.3971C29.2445 16.4805 28.9042 18.4805 28.2236 20.3971C27.5431 22.3138 26.6125 24.0916 25.432 25.7305C24.2514 27.3694 22.8486 28.8555 21.2236 30.1888C19.5986 31.5221 17.8278 32.6471 15.9111 33.5638ZM19.2445 27.4805C21.2167 25.8138 22.8209 23.8624 24.057 21.6263C25.2931 19.3902 25.9111 16.9805 25.9111 14.3971C25.9111 11.3694 24.8625 8.80686 22.7653 6.70964C20.6681 4.61241 18.1056 3.5638 15.0778 3.5638C12.05 3.5638 9.48752 4.61241 7.3903 6.70964C5.29308 8.80686 4.24447 11.3694 4.24447 14.3971C4.24447 17.4249 5.29308 19.9874 7.3903 22.0846C9.48752 24.1819 12.05 25.2305 15.0778 25.2305H19.2445V27.4805ZM15.0361 23.5221C15.5084 23.5221 15.9111 23.3555 16.2445 23.0221C16.5778 22.6888 16.7445 22.286 16.7445 21.8138C16.7445 21.3416 16.5778 20.9388 16.2445 20.6055C15.9111 20.2721 15.5084 20.1055 15.0361 20.1055C14.5639 20.1055 14.1611 20.2721 13.8278 20.6055C13.4945 20.9388 13.3278 21.3416 13.3278 21.8138C13.3278 22.286 13.4945 22.6888 13.8278 23.0221C14.1611 23.3555 14.5639 23.5221 15.0361 23.5221ZM13.8278 18.2305H16.3278C16.3278 17.3971 16.4111 16.8138 16.5778 16.4805C16.7445 16.1471 17.2722 15.536 18.1611 14.6471C18.6611 14.1471 19.0778 13.6055 19.4111 13.0221C19.7445 12.4388 19.9111 11.8138 19.9111 11.1471C19.9111 9.73047 19.432 8.66797 18.4736 7.95964C17.5153 7.2513 16.3834 6.89714 15.0778 6.89714C13.8556 6.89714 12.8278 7.23741 11.9945 7.91797C11.1611 8.59852 10.5778 9.42491 10.2445 10.3971L12.5778 11.3138C12.7167 10.8416 12.9806 10.3763 13.3695 9.91797C13.7584 9.45964 14.3278 9.23047 15.0778 9.23047C15.8278 9.23047 16.3903 9.4388 16.7653 9.85547C17.1403 10.2721 17.3278 10.7305 17.3278 11.2305C17.3278 11.7027 17.1889 12.1263 16.9111 12.5013C16.6334 12.8763 16.3 13.2582 15.9111 13.6471C14.9389 14.4805 14.3486 15.1402 14.1403 15.6263C13.932 16.1124 13.8278 16.9805 13.8278 18.2305Z" fill="#3F4C63"/></svg>`;
            let btn = document.createElement('button');
            btn.setAttribute('class', `faqnation-floating-widget-toggle-btn`);
            btn.onclick = () => {
                setWidgetVisibility((v) => !v);
            };
            btn.innerHTML = buttonIcon;
            return btn;
        };

        document.body.appendChild(widgetContainer());

})();