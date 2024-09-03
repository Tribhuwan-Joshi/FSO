const loginWith = async (page, username, password) => {
  // click login btn
  await page.getByRole("button", { name: "log in" }).click();
  await page.getByPlaceholder("username").fill(username);
  await page.getByPlaceholder("password").fill(password);
  await page.getByRole("button", { name: "Let me in" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "Add Blog" }).click();
  await page.locator("#title").fill(title);
  await page.locator("#author").fill(author);
  await page.locator("#url").fill(url);
  await page.getByRole("button", { name: "Add Blog" }).click();
  await page.locator(".blogTitle", { hasText: title }).waitFor();
};

export { loginWith, createBlog };
