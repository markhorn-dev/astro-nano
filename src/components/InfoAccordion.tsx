import { ExternalLinkIcon } from "./ExternalLinkIcon";

const InfoAccordion = () => {
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const textarea = e.currentTarget.querySelector(
      "#issue",
    ) as HTMLTextAreaElement;
    const issue = formData.get("issue");
    try {
      const response = await fetch("/api/gifts/report-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issue: issue }),
      });
      // clear textarea value
      textarea.value = "";
      if (response.ok) {
        alert("Error report sent!");
      } else {
        alert("Issue delivering error report. Try again later");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="mt-10">
      <div className="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-lg font-semibold">Sizing Info</div>
        <div className="collapse-content">
          <ul className="ml-4">
            <li>Shirt</li>
            <p className="ml-4 mb-4">Medium</p>
            <li>Shorts</li>
            <p className="ml-4 mb-4">Medium (7 inch length preferred)</p>
            <li>Sweatshirt</li>
            <p className="ml-4 mb-4">Large</p>
            <li>Pants</li>
            <p className="ml-4 mb-4">32x34</p>
            <li>Shoes</li>
            <p className="ml-4 mb-4">13M US</p>
          </ul>
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-lg font-semibold">
          Things I Always Need
        </div>
        <div className="collapse-content">
          <ul className="ml-4">
            <li>Whey Protein</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>Dymatize Elite Whey Protein Chocolate (5 lb)</p>
              <a
                target="_blank"
                href="https://www.amazon.com/gp/product/B00CUDYY2U/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Casein Protein</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>Dymatize Elite Casein Protein Chocolate (4 lb)</p>
              <a
                target="_blank"
                href="https://www.amazon.com/gp/product/B007L4QMGO/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Creatine</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>CON-CRET Creatine HCl Capsules (90 ct)</p>
              <a
                target="_blank"
                href="https://www.amazon.com/gp/product/B0BKCVLYGX/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Daily Sunscreen</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>elta MD UV Clear Broad Spectrum SPF 46</p>
              <a
                target="_blank"
                href="https://eltamd.com/products/uv-clear-broad-spectrum-spf-46?variant=43130780811417&country=US&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOopd7L2Rex9kaKVhgZ_yX1q8qMKU2XpUm9i1IvziPGkJLRwL9HBshMU"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Retinol Serum</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>The Inkey List Retinol Serum</p>
              <a
                target="_blank"
                href="https://www.sephora.com/product/retinol-serum-P443842"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Hyaluronic Acid Serum</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>The Inkey List Hyaluronic Acid Serum</p>
              <a
                target="_blank"
                href="https://www.sephora.com/product/hyaluronic-acid-hydrating-face-serum-P443845?country_switch=us&lang=en&skuId=2211464&om_mmc=ppc-GG_17798154149___2211464__9008163_c&country_switch=us&lang=en&gad_source=1&gclid=CjwKCAiA65m7BhAwEiwAAgu4JH0lY7uFGSfVpNscylqUrKXFcUS6D15V6QnrW-1-ajKPLFRZ0R2u4hoCBNEQAvD_BwE&gclsrc=aw.ds"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Vitamin C and EGF Sereum</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>The Inkey 15% Vitamn C and EGF Serum</p>
              <a
                target="_blank"
                href="https://www.sephora.com/product/the-inkey-list-15-vitamin-c-egf-brightening-serum-P455368"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Caffeine Eye Cream</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>The Inkey Caffeine Eye Cream</p>
              <a
                target="_blank"
                href="https://www.theinkeylist.com/products/caffeine-eye-cream"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Peptide Moisturizer</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>The Inkey Peptide Moisturizer</p>
              <a
                target="_blank"
                href="https://www.theinkeylist.com/products/peptide-moisturizer?currency=USD&variant=35432169046179&utm_source=google&utm_medium=cpc&utm_campaign=Google%20Shopping&stkn=63717ce8f004&utm_source=google&utm_medium=cpc&tw_source=google&tw_adid=722273168782&tw_campaign=21930180377&gad_source=1&gclid=CjwKCAiAzPy8BhBoEiwAbnM9O7iWAVB8egpekVnzdXVYuFHplrtiu3fvj6ur3oaTR-XWbhqGCok6SRoCwRwQAvD_BwE"
              >
                <ExternalLinkIcon />
              </a>
            </div>
            <li>Facial Cleanser</li>
            <div className="flex ml-4 mb-4 gap-2">
              <p>Anthony's Glycolic Facial Cleanser</p>
              <a
                target="_blank"
                href="https://anthony.com/collections/cleanse-face/products/glycolic-facial-cleanser?gad_source=1&gclid=CjwKCAiAjp-7BhBZEiwAmh9rBXEUIRiX5ODEnaOd7CUj4lrbVhr8ck9H4z6LyfpwJ9rSQ-XZ3qcwchoCLlAQAvD_BwE"
              >
                <ExternalLinkIcon />
              </a>
            </div>
          </ul>
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-lg font-semibold">
          Something Broken? Let Me Know!
        </div>
        <div className="collapse-content">
          <form
            action="/api/gifts/report-error"
            method="POST"
            onSubmit={submitHandler}
          >
            <label>Describe your issue</label>
            <br />
            <textarea
              name="issue"
              id="issue"
              className="border border-stone-600 rounded-lg mt-4 bg-stone-700 py-1 px-2"
              rows={5}
              cols={33}
              maxLength={255}
              required
            />
            <button
              type="submit"
              className="mt-8 mr-12 relative group flex flex-nowrap py-1 px-3 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InfoAccordion;
