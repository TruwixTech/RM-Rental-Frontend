import * as React from "react";
import * as DrawerPrimitives from "@radix-ui/react-dialog";
import { RiCloseLine } from "@remixicon/react";

// Drawer Root
const Drawer: React.FC<React.ComponentPropsWithoutRef<typeof DrawerPrimitives.Root>> = (props) => {
  return <DrawerPrimitives.Root {...props} />;
};
Drawer.displayName = "Drawer";

// Drawer Trigger
const DrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitives.Trigger> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitives.Trigger ref={ref} className={className} {...props} />
  );
});
DrawerTrigger.displayName = "Drawer.Trigger";

// Drawer Close
const DrawerClose = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitives.Close> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitives.Close ref={ref} className={className} {...props} />
  );
});
DrawerClose.displayName = "Drawer.Close";

// Drawer Portal
const DrawerPortal = DrawerPrimitives.Portal;
DrawerPortal.displayName = "DrawerPortal";

// Drawer Overlay
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitives.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitives.Overlay> & { className?: string }
>(({ className, ...props }, forwardedRef) => {
  return (
    <DrawerPrimitives.Overlay
      ref={forwardedRef}
      className={`fixed inset-0 z-50 overflow-y-auto bg-black/30 data-[state=closed]:animate-hide data-[state=open]:animate-dialogOverlayShow ${className}`}
      {...props}
      style={{
        animationDuration: "400ms",
        animationFillMode: "backwards",
      }}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

// Drawer Content
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitives.Content> & { className?: string }
>(({ className, ...props }, forwardedRef) => {
  return (
    <DrawerPortal>
      <DrawerOverlay>
        <DrawerPrimitives.Content
          ref={forwardedRef}
          className={`fixed inset-y-2 mx-auto flex w-[95vw] flex-1 flex-col overflow-y-auto rounded-md border p-4 shadow-lg focus:outline-none max-sm:inset-x-2 sm:inset-y-2 sm:right-2 sm:max-w-lg sm:p-6 border-gray-200 dark:border-gray-900 bg-white dark:bg-[#090E1A] data-[state=closed]:animate-drawerSlideRightAndFade data-[state=open]:animate-drawerSlideLeftAndFade ${className}`}
          {...props}
        />
      </DrawerOverlay>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

// Drawer Header
const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-start justify-between gap-x-4 border-b border-gray-200 pb-4 dark:border-gray-900 ${className}`}
      {...props}
    >
      <div className={`mt-1 flex flex-col gap-y-1 ${className}`}>
        {children}
      </div>
      <DrawerPrimitives.Close asChild>
        <span className=" p-1 hover:bg-gray-100 hover:dark:bg-gray-400/10">
          <RiCloseLine className="size-6" aria-hidden="true" />
        </span>
      </DrawerPrimitives.Close>
    </div>
  );
});
DrawerHeader.displayName = "Drawer.Header";

// Drawer Title
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitives.Title> & { className?: string }
>(({ className, ...props }, forwardedRef) => (
  <DrawerPrimitives.Title
    ref={forwardedRef}
    className={`text-base font-semibold text-gray-900 dark:text-gray-50 ${className}`}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

// Drawer Body
const DrawerBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={`flex-1 py-4 ${className}`} {...props} />;
});
DrawerBody.displayName = "Drawer.Body";

// Drawer Description
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitives.Description> & { className?: string }
>(({ className, ...props }, forwardedRef) => {
  return (
    <DrawerPrimitives.Description
      ref={forwardedRef}
      className={`text-gray-500 dark:text-gray-500 ${className}`}
      {...props}
    />
  );
});
DrawerDescription.displayName = "DrawerDescription";

// Drawer Footer
const DrawerFooter: React.FC<React.HTMLAttributes<HTMLDivElement> & { className?: string }> = ({ className, ...props }) => {
  return (
    <div
      className={`flex flex-col-reverse border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:space-x-2 dark:border-gray-900 ${className}`}
      {...props}
    />
  );
};
DrawerFooter.displayName = "DrawerFooter";

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
