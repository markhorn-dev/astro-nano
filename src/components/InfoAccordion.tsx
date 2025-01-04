const InfoAccordion = () => {
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
              <p className="ml-4 mb-4">Medium</p>
            <li>Sweatshirt</li>
              <p className="ml-4 mb-4">Large</p>
            <li>Dress Shirt</li>
              <p className="ml-4 mb-4">PLACEHOLDER</p>
            <li>Pants</li>
              <p className="ml-4 mb-4">32x34</p>
            <li>Shoes</li>
              <p className="ml-4 mb-4">13M US</p>
          </ul>
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-lg font-semibold">Things I Always Need</div>
        <div className="collapse-content">
        <ul className="ml-4">
            <li>Whey Protein</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://www.amazon.com/gp/product/B00CUDYY2U/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1">Dymatize Elite Whey Protein Chocolate (5 lb)</a>
              </div>
            <li>Casein Protein</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://www.amazon.com/gp/product/B007L4QMGO/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1">Dymatize Elite Casein Protein Chocolate (4 lb)</a>
              </div>
            <li>Creatine</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://www.amazon.com/gp/product/B0BKCVLYGX/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1">CON-CRET Creatine HCl Capsules (90 ct)</a>
              </div>
            <li>Daily Sunscreen</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://eltamd.com/products/uv-clear-broad-spectrum-spf-46?variant=43130780811417&country=US&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOopd7L2Rex9kaKVhgZ_yX1q8qMKU2XpUm9i1IvziPGkJLRwL9HBshMU">elta MD UV Clear Broad Spectrum SPF 46</a>
              </div>
            <li>Retinol Serum</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://www.sephora.com/product/retinol-serum-P443842">The Inkey List Retinol Serum</a>
              </div>
            <li>Hyaluronic Acid Serum</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://www.sephora.com/product/hyaluronic-acid-hydrating-face-serum-P443845?country_switch=us&lang=en&skuId=2211464&om_mmc=ppc-GG_17798154149___2211464__9008163_c&country_switch=us&lang=en&gad_source=1&gclid=CjwKCAiA65m7BhAwEiwAAgu4JH0lY7uFGSfVpNscylqUrKXFcUS6D15V6QnrW-1-ajKPLFRZ0R2u4hoCBNEQAvD_BwE&gclsrc=aw.ds">The Inkey List Hyaluronic Acid Serum</a>
              </div>
            <li>Vitamin C and EGF Sereum</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://www.sephora.com/product/the-inkey-list-15-vitamin-c-egf-brightening-serum-P455368">The Inkey 15% Vitamn C and EGF Serum</a>
              </div>
            <li>Caffeine Eye Cream</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://www.theinkeylist.com/products/caffeine-eye-cream">The Inkey Caffeine Eye Cream</a>
              </div>
            <li>Facial Cleanser</li>
              <div className="ml-4 mb-4">
                <a target="_blank" href="https://anthony.com/collections/cleanse-face/products/glycolic-facial-cleanser?gad_source=1&gclid=CjwKCAiAjp-7BhBZEiwAmh9rBXEUIRiX5ODEnaOd7CUj4lrbVhr8ck9H4z6LyfpwJ9rSQ-XZ3qcwchoCLlAQAvD_BwE">Anthony's Glycolic Facial Cleanser</a>
              </div>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InfoAccordion