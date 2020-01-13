---
title: 底部导航
date: 2019-12-28 17:33:49
tags: 项目经历
---

```js
const checkIsCurrentBottom = () => {
  const isBottom =
    window.pageYOffset + document.body.clientHeight ===
    document.documentElement.scrollHeight;
  return isBottom;
};
const handleScrollCallBack = () => {
  /**
   * 判断滚动条是否到达页面最底部
   */
  const isCurrentBottom = checkIsCurrentBottom();
  handleAddGap(isCurrentBottom);
};
useEffect(() => {
  handleScrollCallBack();
  window.addEventListener("scroll", handleScrollCallBack);
  return () => window.removeEventListener("scroll", handleScrollCallBack);
});

/**
 * bottomNav是一个function 函数
 * 在这个函数里面更新一个全局的状态，会导致调用爆栈
 * 1、Render methods should be a pure function of props and state; 
 * triggering nested component updates from render is not allowed. 
 * If necessary, trigger nested updates in componentDidUpdate.
 * Check the render method of BottomNavigation.
 * 
 * 2、Maximum update depth exceeded. 
 * This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. 
 * React limits the number of nested updates to prevent infinite loops.
 */
/**
 *  tangram 这个项目对css的敏感度要求比较高。底部导航的问题，本来以为只有offline需要修改，前端js这边并没有限制，
 *  后来offline发布后，前端的显示尺寸还是一样的。原因就是css限制了图片的展示大小。应该要先看下css的。
 *  从这也可以看出函数式编程的重要性了，代码中不应该或者尽量少的常量值，尽可能多的配置项，不然offline一修改，你这边也得跟着修改
 *  就算是css的水平垂直居中，也不应该使用固定元素宽高的那种方式。哎！惨遭打脸
 */

/**
 * 通过offline下发的图片尺寸自动更新img大小
 */
let img = new Image()
img.src = finalShowImage
console.log(img.width, img.height)

/**
 * 这个时候打印出来的img.width 和 img.height 有可能是 0。
 * 宽高都是0的这个结果很正常，因为图片的相关数据都没有被加载前它的宽高默认就是0，我们需要它加载完所有的相关数据再获取宽和高
 * 
 * 因此： 需要 onload 加载所有的相关数据后，取宽高
 */


let img = new Image()
img.src = finalShowImage
img.onload = () => {
  setImgSize({ imgWidth: img.width, imgHeight: img.height })
}


/**
 * 通过onload就能获取到图片的宽高了。但onload大一点的图通常都比较慢，
 * 不实用，但只要图片被浏览器缓存，那么图片加载几乎就不用等待即可触发onload，我们要的是占位符。
 * 所以有些人通过缓存获取也可以这么写。
 */

let img = new Image()
img.src = finalShowImage
if (img.complete) {
  console.log(img.width, img.height)
} else {
  img.onload = function () {
    console.log(img.width, img.height)
  }
}



/**
 * 通过定时循环检测获取
 * 各浏览器执行结果都能看到通过快速获取图片大小的方法几乎都在200毫秒以内，
 * 而onload至少五秒以上，这差别之大说明快速获取图片宽高非常实用。
 */
let start_time = new Date().getTime()
let img = new Image()
img.src = finalShowImage
let check = () => {
  if (img.width > 0 || img.height > 0) {
    clearInterval(set)
  }
}
let set = setInterval(check, 40)


/**
 * 这些操作过程要等到componentDidMount之后才能开始进行。所以会比较慢。
 * 有了缓存之后onload就比较快了
 */


/**
 * 底部导航图片已经加装完成，但是却没有立刻渲染。原因
 *   会二次调用 useImage判断图片是否加载完成，useImage也没有占用太多时间，主要是要等到componentDidFirstMount之后才会触发事件
 *
 * 所以图片会先加载，然后调用useImage判断图片是否加载完成，而这个过程一定要等到 componentDidFirstMount ，因此造成 图片加载完成却没有立刻渲染的现象
 *
 * useImage 中的 useEffect 只会执行四次
 * 
 *  但是在network里面是能看到图片的请求的
 */

```


online 踩坑

 - `React.createRef()` 
  - `function component` 在每次状态更新 `updateState` 的时候都会重刷页面，如果 `const video = React.createRef()` 放在 `function component` 中，那么 `setState` 之后 会重新 `React.createRef()`,拿到的 `video.current === null` ，将  `const video = React.createRef()`当成全局变量放在组件外部，则可以保证每次拿到的 `video` 都是原始的，但是多个视频组件被调用就会有问题，多个视频组件触发的行为都是同一个视频组件的。

 - `useRef` 解决了这种问题，更新状态后 始终拿到的是该视频组件的 `video` 
 - `functional component` 还是多使用hook吧，官方文档也都是用的 `useRef`



底部导航

解决方案：如果不需要保底逻辑（未加载完成的时候显示文字），可以直接服务端渲染，效果类似icon宫格
如果需要保底逻辑。对比差别：
先清除缓存，图片下载结束会立即更新，
如果是已有缓存，因为判断图片加载完成需要在客户端进行，所以底部导航也有变化的过程，比icon宫格还是慢一点，和市场部广告出现的时间是一致的。


Tips: 
  - 尝试： 更改样式，文字始终展示，图片加载成功自动覆盖文字。解决image onload判断时间长的问题。
  - 操作： 
  ```js
  let emitFailed = statusDefault === 'failed'

  let imgFailed = emitFailed && showImg
   let imgStyle = {
    width: imgReady ? `${imgWidth / 100}rem` : (imgFailed ? '0' : '1.48rem'),
    height: imgReady ? `${imgHeight / 100}rem` : (imgFailed ? '0' : '0.98rem')
  }

  <p>{text}</p>

  ```
  问题：如果图片加载失败，会展示一段时间的失败图片，再被替换







```js
<ImageHelper imgUniqueId={imgUniqueId} textUniqueId={textUniqueId}/>

function ImageHelper({imgUniqueId, textUniqueId }) {
  let script = `<script type="text/javascript">
  var targetImage_${imgUniqueId} = document.querySelector('#${imgUniqueId}');
  var targetText_${textUniqueId} = document.querySelector('#${textUniqueId}');

  function setImageStyle(textNode, imageNode) {
    if(textNode && imageNode) {
      textNode.style.display = 'none';
      imageNode.style.height = imageNode.naturalHeight / 100 + 'rem';
      imageNode.style.width = imageNode.naturalWidth / 100 + 'rem';
    }
  }
  if(targetImage_${imgUniqueId}) {
    if(!!targetImage_${imgUniqueId}.naturalHeight) {
      setImageStyle(targetText_${textUniqueId}, targetImage_${imgUniqueId})
    } else {
      targetImage_${imgUniqueId}.onload = function() {
        setImageStyle(targetText_${textUniqueId}, targetImage_${imgUniqueId})
      }
    }
  }
  </script>`;

  return <div dangerouslySetInnerHTML={{__html:script }} /> 
}
```



```js
import React, { useRef } from "react";
import cx from "classnames";
import useImageRefSize from '../../../hooks/useImageRefSize'

const zIndex1000 = {
  zIndex: 1000
};

export default function BottomNavigation({
  templateConfig,
  handlers,
  state,
  floorId,
  traceValue = {},
}) {
  const { iPhoneX, isSSR } = state; // 是否 iPhoneX 设备已经存储在 state 里, 兼容服务端 & 客户端, 不需要再重新判断

  const {
    defaultSelected,
    contentList,
    selectedTextColor = "#0086F6",
    defaultTextColor = "#333333",
    type,
    backgroundImage,
    backgroundColor
  } = templateConfig;

  let bottomList = [];
  try {
    bottomList = JSON.parse(contentList);
  } catch (err) {
    console.log(err)
  }

  return (
    <div
      className={cx("nav_bottom_wrapper expose_dom", {
        nav_bottom_wrapper_x_or: iPhoneX
      })}
      style={zIndex1000}
      data-expose-key="tang_page_module_expo"
      data-trace-value={JSON.stringify(traceValue)}
    >
      <div
        className="nav_bottom_flex"
        style={{
          backgroundColor,
          backgroundImage: backgroundImage && `url(${backgroundImage})`
        }}
      >
        {bottomList.map((bottomAnchor, index) => {
          const isCurrent = index === Number(defaultSelected);
          return (
            <BottomNav
              bottomAnchor={bottomAnchor}
              floorId={floorId}
              key={index}
              index={index}
              isCurrent={isCurrent}
              traceValue={traceValue}
              handlers={handlers}
              selectedTextColor={selectedTextColor}
              defaultTextColor={defaultTextColor}
              type={type}
              isSSR={isSSR}
            />
          );
        })}
      </div>
    </div>
  );
}

function BottomNav({
  bottomAnchor,
  index,
  isCurrent,
  traceValue,
  handlers,
  selectedTextColor,
  defaultTextColor,
  floorId,
  type,
  isSSR
}) {
  const buttonSortIndex = index + 1

  const { handleLogClickTrace, handleClick } = handlers;
  const { selectedImage, defaultImage, text } = bottomAnchor;

  const handleClickBottom = (e) => {
    e.preventDefault()
    if (isCurrent) return
    handleGotoNav(e, bottomAnchor);
  }

  const handleGotoNav = (e, urls) => {
    const { clickLinkHttp, clickLinkNative, clickLinkHybrid, clickLinkMiniProgram } = urls;
    handleLogClickTrace(e);
    handleClick({ clickLinkHttp, clickLinkNative, clickLinkHybrid, clickLinkMiniProgram });
  };

  const showImg = type === "0";
  let finalShowImage = isCurrent ? selectedImage : defaultImage

  const imageRef = useRef();
  let [imgWidth, imgHeight] = useImageRefSize(imageRef);

  // 服务端已经加载完成图片, 没有触发onload事件时, 直接判断原始高度 or 触发onload事件时获得的高度
  // 若客户端图片加载失败 imageHasLoaded 返回的是宽高 0，hideText 是 false
  // 客户端的代码一直会执行，
  let imageHasLoaded = (imageRef.current && imageRef.current.naturalHeight || imgWidth)

  let hideText = showImg && imageHasLoaded;

  let imgStyle = {
    width: imgWidth ? `${imgWidth / 100}rem` : 0,
    height: imgHeight ? `${imgHeight / 100}rem` : 0
  }

  // 服务端渲染宽高初始值设置为0，后面计算出高度的时候再覆盖
  if (isSSR) imgStyle = { width: '0', height: '0' }

  let textColor = getTextColor(
    isCurrent,
    type,
    selectedTextColor,
    defaultTextColor
  );

  let imgUniqueId = `bottom_img_${floorId}_${index}`;
  let textUniqueId = `bottom_text_${floorId}_${index}`;

  return (
    <div
      data-trace-key="tang_page_button_click"
      data-trace-value={JSON.stringify({
        ...traceValue,
        button: "bottomtab",
        button_sort: buttonSortIndex,
        tabname: text
      })}
      className={cx("nav_bottom_item", {
        nav_bottom_item_img: hideText
      })}
      onClick={handleClickBottom}
      style={{
        color: textColor
      }}
    >
      {!hideText && <p id={textUniqueId}>{text}</p>}
      {showImg && <img src={finalShowImage} id={imgUniqueId} ref={imageRef} style={imgStyle} />}
      {showImg && <ImageHelper imgUniqueId={imgUniqueId} textUniqueId={textUniqueId} />}
    </div>
  );
}

/**
 * 服务端代码，先于任何生命周期之前执行。
 * 当dom上的img获取到 naturalHeight 或者 监听到 图片的 onload 事件，将图片的大小改变。
 * 服务端渲染时，图片的原始大小一定要设置成 0，因为 如果图片加载失败，会显示一个失败的标签。设置成0 后，就算加载失败，宽高也是0，不会影响展示。
 * 
 * 客户端渲染时，ImageHelper 这段代码不会执行。
 * 通过 useImage 方法判断 图片是否加载完成，图片加载失败 返回的 宽高是 0，也是失败状态
 * 
 * 
 * 
 * 先判断 naturalHeight 高度，是因为服务端加载图片 可能非常快，代码还没执行到 onload，图片已经下载完成，
 * 那就一直都不会触发onload事件，所以先要判断 naturalHeight， 如果 naturalHeight 不为 0，说明图片已经加载完成。
 */
function ImageHelper({ imgUniqueId, textUniqueId }) {
  let script = `<script type="text/javascript">
  var targetImage_${imgUniqueId} = document.querySelector('#${imgUniqueId}');
  var targetText_${textUniqueId} = document.querySelector('#${textUniqueId}');

  function setImageStyle(textNode, imageNode) {
    if(textNode && imageNode) {
      textNode.style.display = 'none';
      imageNode.style.height = imageNode.naturalHeight / 100 + 'rem';
      imageNode.style.width = imageNode.naturalWidth / 100 + 'rem';
    }
  }
  if(targetImage_${imgUniqueId}) {
    if(!!targetImage_${imgUniqueId}.naturalHeight) {
      setImageStyle(targetText_${textUniqueId}, targetImage_${imgUniqueId})
    } else {
      targetImage_${imgUniqueId}.onload = function() {
        setImageStyle(targetText_${textUniqueId}, targetImage_${imgUniqueId})
      }
    }
  }
  </script>`;

  return <div dangerouslySetInnerHTML={{ __html: script }} />
}

const getTextColor = (isCurrent, type, selectedTextColor, defaultTextColor) => {
  let textColor = "";
  if (type === "1") {
    textColor = isCurrent ? "#0086F6" : "#333333";
  } else {
    textColor = isCurrent ? selectedTextColor : defaultTextColor;
  }
  return textColor;
};
```
### 解决问题
  **弹出蒙层后，禁止掉蒙层下面的内容滚动**
   - 方法一
```js
disableWindowScroll() {
  const bodyEl = document.querySelector("body");
  const htmlEl = document.querySelector("html");
  bodyEl.style.overflow = "hidden";
  htmlEl.style.overflow = "hidden";
}
enableWindowScroll() {
  const bodyEl = document.querySelector("body");
  const htmlEl = document.querySelector("html");
  bodyEl.style.overflow = "auto";
  htmlEl.style.overflow = "";
}
```
这种方法虽然能禁用掉页面的滚动，但是如果页面超长的话，会一下滑动到页面最顶部。



  对移动端，可以引入`touch-action`，限制为`none`，但`ios`的`safari`上不支持该属性,这时候，就需要结合`event.preventDefault`属性来用了。注意在绑定`addEventListener`的时候，需要多传一个`options`，强调这个事件不是`passive`的，否则谷歌等新版浏览器会报错。同时最好也指定capture: true，这样可以早点禁止该事件。报错是`Unable to preventDefault inside passive event listener due to target being treated as passive.`谷歌建议一般情况下，将 `passive` 标志添加到每个没有调用 `preventDefault()` 的 `wheel`、`mousewheel`、`touchstart` 和 `touchmove` 事件侦听器,
  - 方法二
```js
preventDefaultBehavior = e => {
    e.preventDefault();
  };
disableWindowScroll = () => {
  const bodyEl = document.querySelector("body");
  bodyEl.addEventListener("touchmove", this.preventDefaultBehavior, {
    passive: false,
    capture: true
  });
}
enableWindowScroll = () => {
  const bodyEl = document.querySelector("body");
  bodyEl.removeEventListener("touchmove", this.preventDefaultBehavior, {
    passive: false,
    capture: true
  });
}
```
  上述方法会禁用掉浏览器的所有滚动事件

 - 方法三

  ```js
    getScrollY = () => {
    return window.scrollY
  }

  disableWindowScroll = () => {
    const bodyEl = document.querySelector('body');
    const top = this.getScrollY()
    bodyEl.style.position = "fixed"
    bodyEl.style.width = "100%"
    bodyEl.style.top = -top + 'px'
  };


  enableWindowScroll = () => {
    const bodyEl = document.querySelector('body');
    //这里top 通过getComputedStyle获取top，在IOS设备是不正确的，始终为0，Android设备和浏览器端都是正常的
    //这是为什么？
    const top = -bodyEl.style.top.split('px')[0]
    bodyEl.style.position = ''
    bodyEl.style.top = ''
    window.scrollTo(0, top)
  };
  ```
