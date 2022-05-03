#![deny(clippy::all)]
use napi_derive::napi;
use scraper::{ElementRef, Html, Selector};

struct ElementWrapper {
  element: ElementRef<'static>,
}

#[napi]
pub struct HtmlElement {
  inner: ElementWrapper,
}

#[napi]
impl HtmlElement {
  // #[napi(constructor)]
  // pub fn constructor() {}

  fn new(element: ElementRef) -> Self {
    let element: ElementRef = unsafe { std::mem::transmute::<_, ElementRef<'static>>(element) };
    Self {
      inner: ElementWrapper { element },
    }
  }

  #[napi]
  pub fn inner_text(&self) -> String {
    self.inner.element.text().collect::<String>()
  }

  #[napi]
  pub fn select(&self, selector: String) -> Vec<HtmlElement> {
    self
      .inner
      .element
      .select(&Selector::parse(&selector).unwrap())
      .map(|e| Self::new(e))
      .collect()
  }

  #[napi]
  pub fn inner_html(&self) -> String {
    self.inner.element.inner_html()
  }

  #[napi]
  pub fn html(&self) -> String {
    self.inner.element.html()
  }

  #[napi]
  pub fn first_child(&self) -> Option<HtmlElement> {
    let child = self.inner.element.first_child()?;

    ElementRef::wrap(child).map(|e| Self::new(e))
  }
}

#[napi(js_name = "HtmlDocument")]
struct HtmlDocument {
  document: Html,
}

#[napi]
impl HtmlDocument {
  #[napi(constructor)]
  pub fn new(str: String) -> Self {
    HtmlDocument {
      document: Html::parse_document(&str),
    }
  }

  #[napi]
  pub fn select(&self, selector: String) -> Vec<HtmlElement> {
    let selector = Selector::parse(&selector);

    self
      .document
      .select(&selector.unwrap())
      .map(|element| HtmlElement::new(element))
      .collect()
  }
}
