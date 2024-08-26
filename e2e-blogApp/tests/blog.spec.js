const { expect, test, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./test_helper");

describe("BlogApp", () => {
  beforeEach(async ({ page, request }) => {
    // reset DB and create new user
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        username: "root",
        name: "root",
        password: "root",
      },
    });
    await page.goto("/");
  });

  test("blog heading is visible", async ({ page }) => {
    const locator = await page.getByText("blogs");
    await expect(locator).toBeVisible();
  });

  test("login button is visible", async ({ page }) => {
    const btn = await page.getByRole("button", { name: "log in" });
    await expect(btn).toBeVisible();
  });

  describe("Login", () => {
    test("succeed with correct credentials", async ({ page }) => {
      await loginWith(page, "root", "root");
      await expect(page.getByText("Welcome root")).toBeVisible();
    });
    test("failed with wrong credentials", async ({ page }) => {
      await loginWith(page, "root", "wrong");
      await expect(page.getByText("Welcome root")).not.toBeVisible();
      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toHaveText("Error - invalid username or password");
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "root", "root");
    });
    test("user can create a blog", async ({ page }) => {
      await createBlog(page, "demo-title", "demo-author", "demo-url");
      const blogDiv = page.locator(".blogTitle");
      await expect(blogDiv).toHaveText("demo-title");
    });
    test("blog can be liked", async ({ page }) => {
      // open the full detail
      await createBlog(page, "demo-title", "demo-author", "demo-url");
      await page.getByRole("button", { name: "view" }).click();
      await page.locator("#likebtn").click();
      await expect(page.locator(".likeCount")).toHaveText("1");
    });
    test("user who added blog can delete it", async ({ page }) => {
      await createBlog(page, "demo-title", "demo-author", "demo-url");
      await page.getByRole("button", { name: "view" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await page.locator("#deleteBlogBtn").click();
      await expect(page.locator(".blogInfo")).not.toBeVisible();
    });
    test("user who didn't added blog can't see delete button", async ({
      page,
      request,
    }) => {
      await createBlog(page, "demo-title", "demo-author", "demo-url");

      // logout and create new user
      await page.getByRole("button", { name: "Log out" }).click();
      await request.post("/api/users", {
        data: {
          username: "root2",
          name: "root2",
          password: "root2",
        },
      });
      await loginWith(page, "root2", "root2");
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.locator("#deleteBlogBtn")).not.toBeVisible();
    });
  });

  test("blogs are sorted in order according to the likes", async ({ page }) => {
    await loginWith(page, "root", "root");
    await createBlog(page, "1 like", "a", "a");
    await createBlog(page, "2 like", "a", "a");

    let arr = await page.locator(".blogInfo").all();
    console.log(arr[1]);
    await arr[1].getByTestId("toggleView").click();
    await arr[1].getByRole("button", { name: "Like" }).click();
    arr = await page.locator(".blogInfo").all();
    await expect(arr[0].locator(".blogTitle")).toHaveText("2 like");
  });
});
