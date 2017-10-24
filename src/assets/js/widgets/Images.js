export default class Images {
  constructor() {
    this.images = [];
  }
  imageCollection(val) {
    this.images.push(val);
  }
}

// export default class Images {
//   static bind(selector) {
//     const target = typeof selector === 'undefined' ? 'body' : selector;
//     const loadedImages = imagesLoaded(target);

//     this.replaceSources(target);

//     loadedImages.on('progress', (instance, image) => {
//       if (image.isLoaded) {
//         const parent = $(image.img).parent();
//         $(image.img).removeClass('is-loading');
//         this.tryImagefill(image.img);

//         parent.addClass('is-loaded');
//       } else {
//         $(image.img).addClass('not-loaded');
//       }
//     });
//   }

//   static imagefill($element, src, imagefill) {
//     const isContain = imagefill === 'contain';
//     const imageSize = isContain ? 'contain' : 'cover';
//     let imagePosition = imagefill;

//     imagePosition = imagePosition === true || imagePosition === '' ? 'center' : imagePosition;
//     imagePosition = isContain ? 'center' : imagePosition;

//     $element.css({
//       'background-image': `url(${src})`,
//       'background-position': imagePosition,
//       'background-repeat': 'no-repeat',
//       'background-size': imageSize,
//     });
//   }

//   static tryImagefill(img) {
//     const $imagefill = $(img).closest('[data-imagefill]');
//     if ($imagefill[0]) {
//       const data = $imagefill.data('imagefill');
//       this.imagefill($imagefill, img.src, data);
//       $(img).remove();
//     }
//   }

//   static replaceSources(selector) {
//     let images = $(selector);
//     const targets = [];

//     images = images[0].nodeName !== 'IMAGE' ? images.find('img') : images;

//     for (let i = images.length - 1; i >= 0; i -= 1) {
//       const itemImage = images.eq(i);
//       const itemSrc = itemImage.attr('src');

//       targets.push({
//         image: itemImage,
//         src: itemSrc,
//       });
//     }

//     for (const target of targets) {
//       target.image[0].src = target.src;
//     }
//   }
// }

