import {
  IconNames,
  StudioCommands,
  CreateEditorOptions,
  LayoutCommandProps,
  StudioLayoutButtonConfigProps,
  StudioLayoutComponentsConfigProps,
} from "@grapesjs/studio-sdk/react";
import {
  rteProseMirror,
  canvasFullSize,
  accordionComponent,
  animationComponent,
  canvasAbsoluteMode,
  canvasEmptyState,
  canvasGridMode,
  dataSourceEjs,
  dataSourceHandlebars,
  dialogComponent,
  flexComponent,
  fsLightboxComponent,
  googleFontsAssetProvider,
  iconifyComponent,
  layoutSidebarButtons,
  lightGalleryComponent,
  listPagesComponent,
  presetPrintable,
  rteTinyMce,
  tableComponent,
  shapeDividerComponent,
  swiperComponent,
  youtubeAssetProvider,
} from "@grapesjs/studio-sdk-plugins";
import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";
import fetcher from "@/utils/fetcher";
import { toast } from "sonner";
import PageTitle from "./PageTitle";

const topSidebarSize = 50;
const iconSize = "24px";

const customIcons = {
  hamburger:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="currentColor"aria-hidden="true"><circle cx="16" cy="16" r="16" fill="white" /><path d="M10 11h12v2H10v-2zM10 15h12v2H10v-2zM10 19h12v2H10v-2z" fill="black" /></svg>',
  slider:
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium eui-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 4.75C13.3096 4.75 12.75 5.30964 12.75 6C12.75 6.69036 13.3096 7.25 14 7.25C14.6904 7.25 15.25 6.69036 15.25 6C15.25 5.30964 14.6904 4.75 14 4.75ZM11.3535 5.25C11.68 4.09575 12.7412 3.25 14 3.25C15.2588 3.25 16.32 4.09575 16.6465 5.25H20C20.4142 5.25 20.75 5.58579 20.75 6C20.75 6.41421 20.4142 6.75 20 6.75H16.6465C16.32 7.90425 15.2588 8.75 14 8.75C12.7412 8.75 11.68 7.90425 11.3535 6.75H4C3.58579 6.75 3.25 6.41421 3.25 6C3.25 5.58579 3.58579 5.25 4 5.25H11.3535ZM8 10.75C7.30964 10.75 6.75 11.3096 6.75 12C6.75 12.6904 7.30964 13.25 8 13.25C8.69036 13.25 9.25 12.6904 9.25 12C9.25 11.3096 8.69036 10.75 8 10.75ZM5.35352 11.25C5.67998 10.0957 6.74122 9.25 8 9.25C9.25878 9.25 10.32 10.0957 10.6465 11.25H20C20.4142 11.25 20.75 11.5858 20.75 12C20.75 12.4142 20.4142 12.75 20 12.75H10.6465C10.32 13.9043 9.25878 14.75 8 14.75C6.74122 14.75 5.67998 13.9043 5.35352 12.75H4C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H5.35352ZM17 16.75C16.3096 16.75 15.75 17.3096 15.75 18C15.75 18.6904 16.3096 19.25 17 19.25C17.6904 19.25 18.25 18.6904 18.25 18C18.25 17.3096 17.6904 16.75 17 16.75ZM14.3535 17.25C14.68 16.0957 15.7412 15.25 17 15.25C18.2588 15.25 19.32 16.0957 19.6465 17.25H20C20.4142 17.25 20.75 17.5858 20.75 18C20.75 18.4142 20.4142 18.75 20 18.75H19.6465C19.32 19.9043 18.2588 20.75 17 20.75C15.7412 20.75 14.68 19.9043 14.3535 18.75H4C3.58579 18.75 3.25 18.4142 3.25 18C3.25 17.5858 3.58579 17.25 4 17.25H14.3535Z"></path></svg>',
  gear: '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall eui-1k33q06" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.9461 4.49382C12.7055 3.50206 11.2945 3.50206 11.0539 4.49382L11.0538 4.49421C10.6578 6.12252 8.79686 6.89441 7.36336 6.02285L7.36299 6.02262C6.49035 5.49135 5.49253 6.49022 6.0235 7.3618C6.22619 7.69432 6.34752 8.06998 6.37762 8.45824C6.40773 8.84659 6.34572 9.23656 6.19663 9.59641C6.04755 9.95627 5.8156 10.2758 5.51966 10.5291C5.22378 10.7823 4.8723 10.9621 4.49382 11.0539C3.50206 11.2945 3.50206 12.7055 4.49382 12.9461L4.49422 12.9462C4.87244 13.0382 5.22363 13.2181 5.51923 13.4714C5.81483 13.7246 6.0465 14.0441 6.19542 14.4037C6.34433 14.7633 6.40629 15.153 6.37625 15.5411C6.34621 15.9292 6.22502 16.3047 6.02253 16.6371C5.49145 17.5098 6.49026 18.5074 7.3618 17.9765C7.69431 17.7738 8.06998 17.6525 8.45824 17.6224C8.84659 17.5923 9.23656 17.6543 9.59641 17.8034C9.95627 17.9525 10.2758 18.1844 10.5291 18.4803C10.7823 18.7762 10.9621 19.1277 11.0539 19.5062C11.2945 20.4979 12.7055 20.4979 12.9461 19.5062L12.9462 19.5058C13.0382 19.1276 13.2181 18.7764 13.4714 18.4808C13.7246 18.1852 14.0441 17.9535 14.4037 17.8046C14.7633 17.6557 15.153 17.5937 15.5411 17.6238C15.9292 17.6538 16.3047 17.775 16.6371 17.9775C17.5097 18.5085 18.5074 17.5097 17.9765 16.6382C17.7738 16.3057 17.6525 15.93 17.6224 15.5418C17.5923 15.1534 17.6543 14.7634 17.8034 14.4036C17.9525 14.0437 18.1844 13.7242 18.4803 13.4709C18.7762 13.2177 19.1277 13.0379 19.5062 12.9461C20.4979 12.7055 20.4979 11.2945 19.5062 11.0539L19.5058 11.0538C19.1276 10.9618 18.7764 10.7819 18.4808 10.5286C18.1852 10.2754 17.9535 9.95594 17.8046 9.59631C17.6557 9.23668 17.5937 8.84698 17.6238 8.45889C17.6538 8.07081 17.775 7.69528 17.9775 7.36285C18.5085 6.49025 17.5097 5.49256 16.6382 6.0235C16.3057 6.22619 15.93 6.34752 15.5418 6.37762C15.1534 6.40773 14.7634 6.34572 14.4036 6.19663C14.0437 6.04755 13.7242 5.8156 13.4709 5.51966C13.2177 5.22378 13.0379 4.8723 12.9461 4.49382ZM9.59624 4.13979C10.2079 1.61994 13.7925 1.62007 14.4039 4.14018L14.4039 4.14039C14.44 4.28943 14.5108 4.42783 14.6105 4.54434C14.7102 4.66085 14.836 4.75216 14.9777 4.81086C15.1194 4.86955 15.2729 4.89397 15.4258 4.88211C15.5787 4.87026 15.7266 4.82247 15.8576 4.74264L15.8578 4.7425C18.0722 3.39347 20.6074 5.92764 19.2586 8.14301L19.2585 8.14315C19.1788 8.27403 19.1311 8.42187 19.1193 8.57465C19.1075 8.72744 19.1318 8.88086 19.1905 9.02245C19.2491 9.16404 19.3403 9.28979 19.4567 9.38949C19.573 9.4891 19.7111 9.5599 19.8598 9.59614C22.3801 10.2075 22.3801 13.7925 19.8598 14.4039L19.8596 14.4039C19.7106 14.44 19.5722 14.5108 19.4557 14.6105C19.3392 14.7102 19.2478 14.836 19.1891 14.9777C19.1304 15.1194 19.106 15.2729 19.1179 15.4258C19.1297 15.5787 19.1775 15.7266 19.2574 15.8576L19.2575 15.8578C20.6065 18.0722 18.0724 20.6074 15.857 19.2586L15.8569 19.2585C15.726 19.1788 15.5781 19.1311 15.4253 19.1193C15.2726 19.1075 15.1191 19.1318 14.9776 19.1905C14.836 19.2491 14.7102 19.3403 14.6105 19.4567C14.5109 19.573 14.4401 19.7111 14.4039 19.8598C13.7925 22.3801 10.2075 22.3801 9.59614 19.8598L9.59609 19.8596C9.55998 19.7106 9.48919 19.5722 9.38948 19.4557C9.28977 19.3392 9.16396 19.2478 9.02228 19.1891C8.88061 19.1304 8.72708 19.106 8.57419 19.1179C8.4213 19.1297 8.27337 19.1775 8.14244 19.2574L8.1422 19.2575C5.92778 20.6065 3.39265 18.0724 4.74138 15.857L4.74147 15.8569C4.82118 15.726 4.86889 15.5781 4.88072 15.4253C4.89255 15.2726 4.86816 15.1191 4.80953 14.9776C4.7509 14.836 4.65969 14.7102 4.54332 14.6105C4.42705 14.5109 4.28893 14.4401 4.14018 14.4039C1.61994 13.7925 1.61994 10.2075 4.14018 9.59614L4.14039 9.59609C4.28943 9.55998 4.42783 9.48919 4.54434 9.38948C4.66085 9.28977 4.75216 9.16396 4.81086 9.02228C4.86955 8.88061 4.89397 8.72708 4.88211 8.57419C4.87026 8.4213 4.82247 8.27337 4.74264 8.14244L4.7425 8.1422C3.39354 5.92791 5.92736 3.39294 8.14263 4.74115C8.70903 5.08552 9.4399 4.7816 9.59614 4.14018M12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75ZM8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12Z"></path></svg>',
  pages:
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium eui-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 2C6.02066 2 5.32118 2.28973 4.80546 2.80546C4.28973 3.32118 4 4.02065 4 4.75V18.75C4 19.4793 4.28973 20.1788 4.80546 20.6945C5.32118 21.2103 6.02065 21.5 6.75 21.5H16.75C17.4793 21.5 18.1788 21.2103 18.6945 20.6945C19.2103 20.1788 19.5 19.4793 19.5 18.75V7.75C19.5 7.55109 19.421 7.36032 19.2803 7.21967L14.2803 2.21967C14.1397 2.07902 13.9489 2 13.75 2H6.75ZM5.86612 3.86612C6.10054 3.6317 6.41848 3.5 6.75 3.5H13V6.75C13 7.21413 13.1844 7.65925 13.5126 7.98744C13.8408 8.31563 14.2859 8.5 14.75 8.5H18V18.75C18 19.0815 17.8683 19.3995 17.6339 19.6339C17.3995 19.8683 17.0815 20 16.75 20H6.75C6.41848 20 6.10054 19.8683 5.86612 19.6339C5.6317 19.3995 5.5 19.0815 5.5 18.75V4.75C5.5 4.41848 5.6317 4.10054 5.86612 3.86612ZM16.9393 7L14.5 4.56066V6.75C14.5 6.8163 14.5263 6.87989 14.5732 6.92678C14.6201 6.97366 14.6837 7 14.75 7H16.9393Z"></path><path d="M8.5 12.25C8.08579 12.25 7.75 12.5858 7.75 13C7.75 13.4142 8.08579 13.75 8.5 13.75H15C15.4142 13.75 15.75 13.4142 15.75 13C15.75 12.5858 15.4142 12.25 15 12.25H8.5Z"></path><path d="M8.5 16.25C8.08579 16.25 7.75 16.5858 7.75 17C7.75 17.4142 8.08579 17.75 8.5 17.75H15C15.4142 17.75 15.75 17.4142 15.75 17C15.75 16.5858 15.4142 16.25 15 16.25H8.5Z"></path></svg>',
  design:
    '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.68 3h.82v18h-2.17c-3.6 0-5.39 0-6.62-.97a4.5 4.5 0 0 1-.74-.74C3 18.06 3 16.27 3 12.68v-1.35c0-3.6 0-5.39.97-6.61a4.5 4.5 0 0 1 .74-.75C5.94 3 7.73 3 11.32 3h1.35Zm6.6 17.03c-.92.73-2.17.91-4.28.96v-9.97h6v1.65c0 3.6 0 5.4-.97 6.61a4.5 4.5 0 0 1-.74.75ZM21 9.52H15v-6.5c2.1.04 3.36.22 4.29.95.27.22.53.47.74.74.8 1 .94 2.38.96 4.8Z" clip-rule="evenodd"/></svg>',
  elements:
    '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 4.5a.75.75 0 0 1 .75.75v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 0 1 0-1.5h6v-6A.75.75 0 0 1 12 4.5Z" clip-rule="evenodd"/></svg>',
  layers:
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium eui-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.6645 3.32918C11.8757 3.22361 12.1242 3.22361 12.3353 3.32918L20.3353 7.32918C20.5894 7.45622 20.7499 7.71592 20.7499 8C20.7499 8.28408 20.5894 8.54378 20.3353 8.67082L12.3353 12.6708C12.1242 12.7764 11.8757 12.7764 11.6645 12.6708L3.66451 8.67082C3.41042 8.54378 3.24992 8.28408 3.24992 8C3.24992 7.71592 3.41042 7.45622 3.66451 7.32918L11.6645 3.32918ZM5.67697 8L11.9999 11.1615L18.3229 8L11.9999 4.83853L5.67697 8ZM3.3291 11.6646C3.51434 11.2941 3.96485 11.1439 4.33533 11.3292L11.9999 15.1615L19.6645 11.3292C20.035 11.1439 20.4855 11.2941 20.6707 11.6646C20.856 12.0351 20.7058 12.4856 20.3353 12.6708L12.3353 16.6708C12.1242 16.7764 11.8757 16.7764 11.6645 16.6708L3.66451 12.6708C3.29403 12.4856 3.14386 12.0351 3.3291 11.6646ZM3.3291 15.6646C3.51434 15.2941 3.96485 15.1439 4.33533 15.3292L11.9999 19.1615L19.6645 15.3292C20.035 15.1439 20.4855 15.2941 20.6707 15.6646C20.856 16.0351 20.7058 16.4856 20.3353 16.6708L12.3353 20.6708C12.1242 20.7764 11.8757 20.7764 11.6645 20.6708L3.66451 16.6708C3.29403 16.4856 3.14386 16.0351 3.3291 15.6646Z"></path></svg>',
  images:
    '<svg viewBox="0 0 24 24"><path d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6" /></svg>',
  windowLink:
    '<svg viewBox="0 0 24 24"><path d="M20.5 7h-17v10.71c0 .48.27.79.5.79h16c.23 0 .5-.31.5-.79V7zM4 4h16c1.1 0 2 1.02 2 2.29V17.7c0 1.27-.9 2.29-2 2.29H4c-1.1 0-2-1.02-2-2.29V6.3C2 5.02 2.9 4 4 4zm8.5 10.86a3.5 3.5 0 0 0-1-6.86h-3a3.5 3.5 0 0 0-.5 6.96v-1.39a2.14 2.14 0 0 1 .54-4.21h2.92a2.14 2.14 0 0 1 1.04 4.01v1.49zM16 10a3.5 3.5 0 0 1-.5 6.96h-3a3.5 3.5 0 0 1-1-6.85v1.45a2.16 2.16 0 0 0 1.03 4.06h2.94a2.16 2.16 0 0 0 .53-4.25V10z"/></svg>',
  desktop:
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium eui-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="Desktop"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.82091 5.29117C4.7847 5.3319 4.75 5.40356 4.75 5.5V15.5C4.75 15.5964 4.7847 15.6681 4.82091 15.7088C4.85589 15.7482 4.88124 15.75 4.88889 15.75H19.1111C19.1188 15.75 19.1441 15.7482 19.1791 15.7088C19.2153 15.6681 19.25 15.5964 19.25 15.5V5.5C19.25 5.40356 19.2153 5.3319 19.1791 5.29117C19.1441 5.25181 19.1188 5.25 19.1111 5.25H4.88889C4.88124 5.25 4.85589 5.25181 4.82091 5.29117ZM3.25 5.5C3.25 4.61899 3.90315 3.75 4.88889 3.75H19.1111C20.0968 3.75 20.75 4.61899 20.75 5.5V15.5C20.75 16.381 20.0968 17.25 19.1111 17.25H4.88889C3.90315 17.25 3.25 16.381 3.25 15.5V5.5ZM6.25 19.5C6.25 19.0858 6.58579 18.75 7 18.75H17C17.4142 18.75 17.75 19.0858 17.75 19.5C17.75 19.9142 17.4142 20.25 17 20.25H7C6.58579 20.25 6.25 19.9142 6.25 19.5Z"></path></svg>',
  tablet:
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium eui-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="Tablet Portrait (up to 1024px)"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.33333 3.25C6.3865 3.25 5.75 3.92825 5.75 4.61111V19.3889C5.75 20.0718 6.3865 20.75 7.33333 20.75H16.6667C17.6135 20.75 18.25 20.0718 18.25 19.3889V4.61111C18.25 3.92825 17.6135 3.25 16.6667 3.25H13.7073C13.735 3.32819 13.75 3.41234 13.75 3.5C13.75 3.91421 13.4142 4.25 13 4.25H11C10.5858 4.25 10.25 3.91421 10.25 3.5C10.25 3.41234 10.265 3.32819 10.2927 3.25H7.33333ZM4.25 4.61111C4.25 2.96211 5.70284 1.75 7.33333 1.75H16.6667C18.2972 1.75 19.75 2.96211 19.75 4.61111V19.3889C19.75 21.0379 18.2972 22.25 16.6667 22.25H7.33333C5.70284 22.25 4.25 21.0379 4.25 19.3889V4.61111Z"></path></svg>',
  mobile:
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium eui-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="Mobile Portrait (up to 767px)"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.66667 4.25C8.24587 4.25 7.75 4.66893 7.75 5.38889V18.6111C7.75 19.3311 8.24587 19.75 8.66667 19.75H15.3333C15.7541 19.75 16.25 19.3311 16.25 18.6111V5.38889C16.25 4.66893 15.7541 4.25 15.3333 4.25H13.7073C13.735 4.32819 13.75 4.41234 13.75 4.5C13.75 4.91421 13.4142 5.25 13 5.25H11C10.5858 5.25 10.25 4.91421 10.25 4.5C10.25 4.41234 10.265 4.32819 10.2927 4.25H8.66667ZM6.25 5.38889C6.25 4.02244 7.24652 2.75 8.66667 2.75H15.3333C16.7535 2.75 17.75 4.02244 17.75 5.38889V18.6111C17.75 19.9776 16.7535 21.25 15.3333 21.25H8.66667C7.24652 21.25 6.25 19.9776 6.25 18.6111V5.38889Z"></path></svg>',
  info: '<svg viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-1.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM8.75 9.85c.05-1.62 1.17-2.8 3.2-2.8 1.87 0 3.12 1.08 3.12 2.6 0 1.04-.52 1.77-1.45 2.33-.9.52-1.15.87-1.15 1.55v.39H10.9l-.01-.47c-.06-1.02.33-1.64 1.28-2.2.84-.5 1.13-.87 1.13-1.54 0-.71-.57-1.23-1.43-1.23-.89 0-1.45.54-1.5 1.37H8.74zm3 7.33c-.68 0-1.13-.43-1.13-1.09 0-.66.45-1.1 1.13-1.1.7 0 1.14.44 1.14 1.1 0 .66-.44 1.09-1.14 1.09z"/></svg>',
  enlarge:
    '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="m14.64 10.43 3.86-3.86v2.68a.75.75 0 0 0 1.5 0V5.5c0-.97-.53-1.5-1.5-1.5h-3.75a.75.75 0 0 0 0 1.5h2.7l-3.88 3.87a.75.75 0 0 0 1.06 1.06Zm-5.27 3.14L5.5 17.44v-2.7a.75.75 0 0 0-1.5 0v3.76c0 .96.53 1.5 1.5 1.5h3.75a.75.75 0 0 0 0-1.5h-2.7l3.88-3.87a.75.75 0 0 0-1.06-1.06Z" clip-rule="evenodd"/></svg>',
};

const publishWebsite = async (editor: Editor) => {
  const html = editor.getHtml();
  const css = editor.getCss();
  // const metadata = editor.getProjectData()

  await fetcher.post({
    endpointPath: "/pages",
    data: {
      title: "My Website",
      slug: "my-website",
      html,
      css,
      status: "published",
      // metadata
    },
    fallbackErrorMessage: "Error publishing website",
    onSuccess: () => {
      toast.success("Website published successfully");
      editor.trigger("publish:done");
    },
    onError: () => {
      editor.trigger("publish:error", { message: "Error publishing website" });
    },
    statusShouldBe: 200,
    finallyDoThis: () => {
      // Reset the editor state
    },
  });

  console.log({
    html,
    css,
    // metadata,
  });
};

const toggleActiveCommand = (
  cmd: string
): StudioLayoutButtonConfigProps["editorEvents"] => ({
  [`command:run:${cmd}`]: ({ setState }) => setState({ active: true }),
  [`command:stop:${cmd}`]: ({ setState }) => setState({ active: false }),
});

const createTopbarPanel = () => {
  const separator: StudioLayoutComponentsConfigProps = {
    type: "column",
    style: {
      borderRightWidth: "1px",
      borderRightStyle: "solid",
      alignSelf: "stretch",
      opacity: 0.5,
    },
    className: "h-full",
  };
  const panel: StudioLayoutComponentsConfigProps = {
    type: "row",
    className: "text-white gap-2 items-center w-full pl-3 h-full",
    style: { background: "transparent" },
    children: [
      {
        id: "btn-properties",
        type: "button",
        tooltip: "Home",
        icon: customIcons.hamburger,
        className: "h-full flex items-center",
        onClick: ({ editor, event }) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const layout: LayoutCommandProps = {
            id: "homePanel",
            layout: {
              type: "custom",
              component: () => <div className="p-2">History</div>,
            },
            header: { label: "Theme Builder" },
            placer: {
              type: "popover",
              closeOnClickAway: true,
              x: rect.x,
              y: rect.y,
              w: rect.width,
              h: rect.height,
              options: { placement: "top-end" },
            },
            style: {
              height: 300,
              width: 230,
              backgroundColor: "rgb(12, 13, 14)",
              color: "rgb(255, 255, 255)",
            },
          };
          editor.runCommand(StudioCommands.layoutToggle, { ...layout });
        },
      },
      {
        id: "btn-elements",
        type: "button",
        tooltip: "Add Element",
        className: "h-full flex items-center",
        icon: customIcons.elements,
        onClick: ({ editor }) => {
          editor.runCommand("studio:layoutToggle", {
            id: "panelBlocks",
            layout: { type: "panelBlocks" },
            header: { label: "Elements" },
            style: { width: 300, height: "100vh", overflowY: "auto" },
            placer: {
              type: "static",
              layoutId: "hiddenLeftContainer",
            },
          });
        },
      },
      {
        id: "btn-properties",
        type: "button",
        tooltip: "Site Settings",
        icon: customIcons.slider,
        className: "h-full flex items-center",
        onClick: ({ editor }) => {
          editor.runCommand("studio:layoutToggle", {
            id: "layoutProperties",
            layout: { type: "panelGlobalStyles" },
            header: { label: "Properties" },
            style: { width: 300 },
            placer: {
              type: "static",
              layoutId: "hiddenLeftContainer",
            },
          });
        },
      },
      {
        id: "btn-pages",
        type: "button",
        tooltip: "Pages",
        className: "h-full flex items-center",
        icon: customIcons.pages,
        onClick: ({ editor }) => {
          editor.runCommand("studio:layoutToggle", {
            id: "layoutPages",
            layout: { type: "panelPages" },
            header: { label: "Pages" },
            style: { width: 300 },
            placer: {
              type: "static",
              layoutId: "hiddenLeftContainer",
            },
          });
        },
      },
      {
        id: "btn-layers",
        type: "button",
        tooltip: "Structure",
        icon: customIcons.layers,
        className: "h-full flex items-center",
        onClick: ({ editor }) => {
          editor.runCommand("studio:layoutToggle", {
            id: "layoutLayers",
            layout: { type: "panelLayers" },
            header: { label: "Layers" },
            style: { width: 300 },
            placer: {
              type: "popover",
              x: window.screen.width,
              y: 150,
              closeOnClickAway: true,
            },
          });
        },
      },
      { type: "custom", component: ({ editor }) => <PageTitle editor={editor} /> },
      {
        type: "row",
        className:
          "flex justify-center items-center flex-grow gap-2 bg-black h-full ",
        style: {
          backgroundColor: "black",
        },
        children: [
          separator,
          {
            type: "button",
            tooltip: "Settings",
            icon: { icon: customIcons.gear, size: iconSize },
            className: "flex items-center justify-center h-full",
            onClick: ({ editor }) => {
              editor.runCommand("studio:layoutToggle", {
                id: "layoutDesign",
                layout: { type: "panelTemplates" },
                style: { height: 300 },
                header: { label: "Design" },
                placer: {
                  type: "dialog",
                  title: "Templates",
                  size: "l",
                },
              });
            },
          },
          separator,
          {
            type: "button",
            tooltip: "Desktop",
            icon: customIcons.desktop,
            className: "gs-top-active flex items-center justify-center h-full",
            onClick: ({ editor }) => editor.Devices.select("desktop"),
            editorEvents: {
              "device:select": ({ editor, setState }) => {
                setState({
                  className:
                    editor.Devices.getSelected()?.id === "desktop"
                      ? "gs-top-active"
                      : "",
                });
              },
            },
          },
          {
            type: "button",
            tooltip: "Tablet",
            icon: customIcons.tablet,
            className: "flex items-center justify-center h-full",
            onClick: ({ editor }) => editor.Devices.select("tablet"),
            editorEvents: {
              "device:select": ({ editor, setState }) => {
                setState({
                  className:
                    editor.Devices.getSelected()?.id === "tablet"
                      ? "gs-top-active"
                      : "",
                });
              },
            },
          },
          {
            type: "button",
            tooltip: "Mobile",
            icon: customIcons.mobile,
            className: "flex items-center justify-center h-full",
            onClick: ({ editor }) => editor.Devices.select("mobile"),
            editorEvents: {
              "device:select": ({ editor, setState }) => {
                setState({
                  className:
                    editor.Devices.getSelected()?.id === "mobile"
                      ? "gs-top-active"
                      : "",
                });
              },
            },
          },
          separator,
        ],
      },
      {
        type: "button",
        icon: { icon: customIcons.info, size: iconSize },
        tooltip: "Ask",
        className: "h-full flex items-center",
        onClick: ({ editor, event }) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const layout: LayoutCommandProps = {
            id: "askPanel",
            layout: {
              type: "custom",
              component: () => <div className="p-2">Custom Ask componet</div>,
            },
            header: { label: "Ask" },
            placer: {
              type: "popover",
              closeOnClickAway: true,
              x: rect.x,
              y: rect.y,
              w: rect.width,
              h: rect.height,
              options: { placement: "top-end" },
            },
            style: { height: 300, width: 230 },
          };
          editor.runCommand(StudioCommands.layoutToggle, { ...layout });
        },
      },
      {
        id: "preview",
        type: "button",
        icon: { icon: IconNames.eye, size: iconSize },
        onClick: ({ editor }) => editor.Commands.run("core:preview"),
        className: "ml-auto h-full flex items-center",
        editorEvents: toggleActiveCommand("core:preview"),
      },
      {
        type: "row",
        className: "ml-auto px-0 h-full flex items-center",
        style: {
          backgroundColor: "#FFC5F3",
        },
        children: [
          {
            id: "publish",
            type: "button",
            label: <span className="flex items-center">Publish</span>,
            className: "px-4 text-black h-full flex items-center",
            onClick: ({ editor }) => publishWebsite(editor),
            style: { backgroundColor: "#FFC5F3", borderColor: "#FFC5F3" },
          },
          {
            type: "column",
            style: {
              borderRightWidth: "1px",
              borderRightStyle: "solid",
              alignSelf: "stretch",
              opacity: 1,
              borderColor: "rgb(235, 142, 251)",
            },
            className: "h-full justify-center",
          },
          {
            type: "button",
            tooltip: "Save Options",
            label: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z" />
              </svg>
            ),
            className: "flex items-center justify-center text-black h-full",
            onClick: ({ editor, event }) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const layout: LayoutCommandProps = {
                id: "publishPanel",
                layout: {
                  type: "column",
                  className: "flex flex-col p-1",
                  children: [
                    {
                      type: "button",
                      className:
                        "px-2 py-1 cursor-pointer text-zinc-200 bg-zinc-900 hover:bg-zinc-800",
                      label: "Save Draft",
                      onClick: ({ editor }) => editor.store(),
                    },
                    {
                      type: "button",
                      className:
                        "px-2 py-1 cursor-pointer text-zinc-200 bg-zinc-900 hover:bg-zinc-800",
                      label: "Save & Publish",
                      onClick: ({ editor }) => publishWebsite(editor),
                    },
                    {
                      type: "button",
                      className:
                        "px-2 py-1 cursor-pointer text-zinc-200 bg-zinc-900 hover:bg-zinc-800",
                      label: "Download locally",
                      onClick: ({ editor }) => {
                        const html = editor.getHtml();
                        const css = editor.getCss();
                        const blob = new Blob(
                          [
                            `
<!DOCTYPE html>
<html>
  <head>
    <style>${css}</style>
  </head>
  <body>${html}</body>
</html>`,
                          ],
                          { type: "text/html" }
                        );

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "project.html";
                        a.click();
                        URL.revokeObjectURL(url);
                      },
                    },
                  ],
                },
                header: { label: "Save" },
                placer: {
                  type: "popover",
                  closeOnClickAway: true,
                  x: rect.x,
                  y: rect.y,
                  w: rect.width,
                  h: rect.height,
                },
                style: { width: 230 },
              };
              editor.runCommand("studio:layoutToggle", { ...layout });
            },
          },
        ],
      },
    ],
  };

  return panel;
};

export const defaultAssets = Array(20)
  .fill(0)
  .map((_, i) => `https://picsum.photos/seed/${i}/300/300`);

export const globalStylesConfig: CreateEditorOptions["globalStyles"] = {
  default: [
    // Body
    {
      id: "bodyBg",
      property: "background-color",
      field: "color",
      selector: "body",
      label: "Body background",
      defaultValue: "white",
      category: { id: "body", label: "Body styles", open: true },
    },
    {
      id: "bodyColor",
      property: "color",
      field: "color",
      selector: "body",
      label: "Body color",
      defaultValue: "#484c51",
      category: { id: "body" },
    },
    // H1
    {
      id: "h1Color",
      property: "color",
      field: "color",
      selector: "h1",
      label: "H1 color",
      defaultValue: "inherit",
      category: { id: "h1", label: "H1", open: true },
    },
    {
      id: "h1Size",
      property: "font-size",
      field: { type: "number", min: 0.1, max: 10, step: 0.1, units: ["rem"] },
      defaultValue: "2rem",
      selector: "h1",
      label: "H1 size",
      category: { id: "h1" },
    },
  ],
};

export const customThemeConfig: CreateEditorOptions["customTheme"] = {
  default: {
    colors: {
      global: {
        // background3: '#f0f1f5',
        text: "rgba(13, 18, 22, .7)",
      },
    },
  },
};

export const pluginsConfig: CreateEditorOptions["plugins"] = [
  dialogComponent.init({
    block: { category: "Basic", label: "Dialog" },
  }),
  googleFontsAssetProvider.init({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY,
  }),
  (editor) => {
    editor.onReady(() => {
      const textCmp = editor.getWrapper()?.find("p")[0];
      editor.select(textCmp);
    });
  },
];

export const deviceConfig: CreateEditorOptions["devices"] = {
  default: [
    {
      id: "desktop",
      name: "Desktop",
      width: "800px",
      widthMedia: "",
    },
    {
      id: "tablet",
      name: "Tablet",
      width: "600px",
    },
    {
      id: "mobile",
      name: "Mobile",
      width: "480px",
    },
  ],
};

export const layoutConfig: CreateEditorOptions["layout"] = {
  default: {
    type: "column",
    className: "h-full",
    children: [
      {
        type: "sidebarTop",
        height: topSidebarSize,
        className: "items-center",
        style: {
          backgroundImage:
            "linear-gradient(90deg, rgb(12, 13, 14), rgb(12, 13, 14))",
        },
        children: createTopbarPanel(),
      },
      {
        type: "row",
        className: "flex-grow",
        children: [
          { type: "column", id: "hiddenLeftContainer" },
          { type: "canvas", grow: false },
          {
            type: "sidebarRight",
            children: {
              type: "tabs",
              value: "styles",
              tabs: [
                {
                  id: "styles",
                  label: "Styles",
                  children: {
                    type: "column",
                    style: { height: "100%" },
                    children: [
                      { type: "panelSelectors", style: { padding: 5 } },
                      { type: "panelStyles" },
                    ],
                  },
                },
                {
                  id: "props",
                  label: "Properties",
                  children: {
                    type: "panelProperties",
                    style: { padding: 5, height: "100%" },
                  },
                },
                {
                  id: "custom",
                  label: "Custom",
                  children: ["New custom tab"],
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
