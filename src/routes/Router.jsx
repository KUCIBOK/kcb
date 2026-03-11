import { memo, lazy, Suspense } from "react";
import { PageLoader } from "../components/loaders/PageLoader";
import { Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "../pages/Layout";
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const CheckEmail = lazy(() => import("../pages/auth/CheckEmail"));
const ResetPasswordForm = lazy(() => import("../pages/ForgotPassword"));
const ForgotPasswordForm = lazy(() => import("../pages/ForgotPasswordForm"));
const About = lazy(() => import("../pages/About"));
const Explore = lazy(() => import("../pages/Explore"));
const Blog = lazy(() => import("../pages/Blog"));
const Artists = lazy(() => import("../pages/Artists"));
const Auctions = lazy(() => import("../pages/Auctions"));
const AuctionDetails = lazy(() => import("../pages/AuctionDetails"));
const Faq = lazy(() => import("../pages/Faq"));
const Contact = lazy(() => import("../pages/Contact"));
const Artwork = lazy(() => import("../pages/Artwork"));
const BlogPostDetails = lazy(() => import("../pages/BlogPostDetails"));
const ArtistDetails = lazy(() => import("../pages/Artist"));
const Error404 = lazy(() => import("../components/fallback/Error404"));
const Artist = lazy(() => import("../pages/dashboard/Artist"));
const SubmitArtwork = lazy(() => import("../pages/dashboard/SubmitArtwork"));
const Collector = lazy(() => import("../pages/dashboard/Collector"));
const Professional = lazy(() => import("../pages/dashboard/Professional"));
const Admin = lazy(() => import("../pages/dashboard/Admin"));
const ArtworkCheckout = lazy(() => import("../pages/ArtworkCheckout"));
const ArtworkPurchaseSuccess = lazy(() =>
  import("../pages/ArtworkPurchaseSuccess")
);
const ArtworkPurchaseFailed = lazy(() =>
  import("../pages/ArtworkPurchaseFailed")
);
const SubscriptionPlanCheckout = lazy(() =>
  import("../pages/SubscriptionPlanCheckout")
);
const SubscriptionPlanSuccess = lazy(() =>
  import("../pages/SubscriptionSuccess")
);
const SubscriptionPlanFailed = lazy(() =>
  import("../pages/SubscriptionFailed")
);
const PayDunyaSuccess = lazy(() => import("../pages/PayDunyaSuccess"));
const PayDunyaFailed = lazy(() => import("../pages/PayDunyaFailed"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndConditions"));
const SalesConditions = lazy(() => import("../pages/SalesConditions"));
const EthicChart = lazy(() => import("../pages/EthicChart"));
const TrackingPage = lazy(() => import("../pages/TrackingPage"));
const AfricaLanding = lazy(() => import("../pages/AfricaLanding"));
const GatewayPage = lazy(() => import("../pages/GatewayPage"));
const Marketplace = lazy(() => import("../pages/Marketplace"));
const GlobalPage = lazy(() => import("../pages/GlobalPage"))
const VerifyArtwork = lazy(() => import("../pages/VerifyArtwork"));
const CataloguePro = lazy(() => import("../pages/CataloguePro"));
// Protected Routes
import { GuestProtectedRoute } from "../utils/GuestProtectedRoute";
import { ArtistProtectedRoute } from "../utils/ArtistProtectedRoute";
import { CollectorProtectedRoute } from "../utils/CollectorProtectedRoute";
import { ProfessionalProtectedRoute } from "../utils/ProfessionalProtectedRoute";
import { AdminProtectedRoute } from "../utils/AdminProtectedRoute";
import { AuthProtectedRoute } from "../utils/AuthProtectedRoute";
const GoogleRoleSelection = lazy(() => import("../pages/auth/GoogleRoleSelection"));
const OAuthCallback = lazy(() => import("../pages/auth/OAuthCallback"));

// Context Providers/Store Imports
import { AuthContextProvider } from "../store/AuthContext";
import { ArtworksContextProvider } from "../store/ArtworkContext";
import { ArtistContextProvider } from "../store/ArtistContext";
import { BlogContextProvider } from "../store/BlogContext";
import { UserProvider } from "../store/UsersStore";
import { PlanProvider } from "../store/PlanContext";
import { CategoryProvider } from "../store/CategoryStore";
import { CollectionProvider } from "../store/CollectionStore";
import { DeliveryContextProvider } from "../store/DeliveryStore";
import { NumerisationProvider } from "../store/NumerisationStore";
import { ClientProvider } from "../store/ClientContext";
import { GalleryContextProvider } from "../store/GalleryContext";

// AutoAuth component
import { AutoAuth } from "../store/AutoAuth";
export function Router() {
  return (
    <>
      <Routes>
        <Route
          element={
            <AuthContextProvider>
              <ArtistContextProvider>
                <ArtworksContextProvider>
                  <BlogContextProvider>
                    <UserProvider>
                      <PlanProvider>
                        <CategoryProvider>
                          <CollectionProvider>
                            <DeliveryContextProvider>
                              <NumerisationProvider>
                                <ClientProvider>
                                  <GalleryContextProvider>
                                    <AutoAuth />
                                    <Outlet />
                                  </GalleryContextProvider>
                                </ClientProvider>
                              </NumerisationProvider>
                            </DeliveryContextProvider>
                          </CollectionProvider>
                        </CategoryProvider>
                      </PlanProvider>
                    </UserProvider>
                  </BlogContextProvider>
                </ArtworksContextProvider>
              </ArtistContextProvider>
            </AuthContextProvider>
          }
        >
          {/* Gateway — standalone split-screen entry */}
          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              <GatewayPage />
            </Suspense>
          } />

          <Route element={<Layout />}>
            {/* Fait */}
            <Route path="/explore" element={
                <Suspense fallback={<PageLoader />}>
                  <Explore />
                </Suspense>
              }
            />
            <Route path="/explore/:category" element={
                <Suspense fallback={<PageLoader />}>
                  <Explore />
                </Suspense>
              }
            />
            <Route path="/marketplace" element={
                <Suspense fallback={<PageLoader />}>
                  <Marketplace />
                </Suspense>
              }
            />
            <Route path="/blog" element={
                <Suspense fallback={<PageLoader />}>
                  <Blog />
                </Suspense>
              }
            />
            <Route path="/blog/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <BlogPostDetails />
                </Suspense>
              }
            />
            <Route path="/artists" element={
                <Suspense fallback={<PageLoader />}>
                  <Artists />
                </Suspense>
              }
            />

            <Route path="/artwork/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <Artwork />
                </Suspense>
              }
            />

            <Route path="/artist/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <ArtistDetails />
                </Suspense>
              }
            />
            {/* Routes de paiement — protégées par authentification */}
            <Route element={<AuthProtectedRoute />}>
              <Route path="/artwork-checkout/:id" element={
                  <Suspense fallback={<PageLoader />}>
                    <ArtworkCheckout />
                  </Suspense>
                }
              />
              <Route path="/subscription-checkout/:id" element={
                  <Suspense fallback={<PageLoader />}>
                    <SubscriptionPlanCheckout />
                  </Suspense>
                }
              />
            </Route>
            {/* Résultats de paiement — accessibles pour afficher confirmation/erreur */}
            <Route path="/artwork-purchase-success/:transactionId" element={
                <Suspense fallback={<PageLoader />}>
                  <ArtworkPurchaseSuccess />
                </Suspense>
              }
            />
            <Route path="/artwork-purchase-failed/:transactionId" element={
                <Suspense fallback={<PageLoader />}>
                  <ArtworkPurchaseFailed />
                </Suspense>
              }
            />
            <Route path="/artwork-success/:transactionId" element={
                <Suspense fallback={<PageLoader />}>
                  <PayDunyaSuccess />
                </Suspense>
              }
            />
            <Route path="/artwork-failed/:transactionId" element={
                <Suspense fallback={<PageLoader />}>
                  <PayDunyaFailed />
                </Suspense>
              }
            />
            <Route path="/subscription-success/:subscriptionId" element={
                <Suspense fallback={<PageLoader />}>
                  <SubscriptionPlanSuccess />
                </Suspense>
              }
            />
            <Route path="/subscription-failed/:subscriptionId" element={
                <Suspense fallback={<PageLoader />}>
                  <SubscriptionPlanFailed />
                </Suspense>
              }
            />
            <Route path="/tracking/:trackingId" element={
                <Suspense fallback={<PageLoader />}>
                  <TrackingPage />
                </Suspense>
              }
            />
          </Route>

          {/* Pages standalone — avec leur propre header/footer, hors Layout */}
          <Route path="/about" element={
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          } />
          <Route path="/faq" element={
            <Suspense fallback={<PageLoader />}>
              <Faq />
            </Suspense>
          } />
          <Route path="/africa" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaLanding />
            </Suspense>
          } />
          <Route path="/global" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalPage />
            </Suspense>
          } />
          <Route path="/privacy-policy" element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="/terms-and-conditions" element={
            <Suspense fallback={<PageLoader />}>
              <TermsAndConditions />
            </Suspense>
          } />
          <Route path="/sales-conditions" element={
            <Suspense fallback={<PageLoader />}>
              <SalesConditions />
            </Suspense>
          } />
          <Route path="/ethic-chart" element={
            <Suspense fallback={<PageLoader />}>
              <EthicChart />
            </Suspense>
          } />

          {/* Standard Kucibok — vérification publique (scannable via QR, sans auth) */}
          <Route path="/verify/:kuciobkId" element={
            <Suspense fallback={<PageLoader />}>
              <VerifyArtwork />
            </Suspense>
          } />

          {/* Artist protected routes */}
          <Route path="/dashboard/artist" element={<ArtistProtectedRoute />}>
            <Route path="" element={
                <Suspense fallback={<PageLoader />}>
                  <Artist />
                </Suspense>
              }
            />
            <Route path="submit-artwork" element={
                <Suspense fallback={<PageLoader />}>
                  <SubmitArtwork />
                </Suspense>
              }
            />
          </Route>

          {/* Collector protected routes */}
          <Route
            path="/dashboard/collector"
            element={<CollectorProtectedRoute />}
          >
            <Route path="" element={
                <Suspense fallback={<PageLoader />}>
                  <Collector />
                </Suspense>
              }
            />
          </Route>

          {/* Professional protected routes */}
          <Route
            path="/dashboard/professional"
            element={<ProfessionalProtectedRoute />}
          >
            <Route path="" element={
                <Suspense fallback={<PageLoader />}>
                  <Professional />
                </Suspense>
              }
            />
            <Route path="add-artwork" element={
                <Suspense fallback={<PageLoader />}>
                  <SubmitArtwork />
                </Suspense>
              }
            />
          </Route>

          {/* F3 — Catalogue certifié (professional + admin) */}
          <Route path="/catalogue" element={<ProfessionalProtectedRoute />}>
            <Route path="" element={
              <Suspense fallback={<PageLoader />}>
                <CataloguePro />
              </Suspense>
            } />
          </Route>

          {/* Admin protected routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/dashboard/admin" element={
                <Suspense fallback={<PageLoader />}>
                  <Admin />
                </Suspense>
              }
            />
            {/* Enchères — masquées du nav public, accessibles admin uniquement (Phase 3+) */}
            <Route path="/auction" element={
                <Suspense fallback={<PageLoader />}>
                  <Auctions />
                </Suspense>
              }
            />
            <Route path="/auction/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <AuctionDetails />
                </Suspense>
              }
            />
          </Route>

          {/* Guest protected routes */}
          <Route element={<GuestProtectedRoute />}>
            <Route path="/sign-in" element={
                <Suspense fallback={<PageLoader />}>
                  <SignIn />
                </Suspense>
              }
            />
            <Route path="/sign-up" element={
                <Suspense fallback={<PageLoader />}>
                  <SignUp />
                </Suspense>
              }
            />
            <Route path="/forgot-password" element={
                <Suspense fallback={<PageLoader />}>
                  <ForgotPasswordForm />
                </Suspense>
              }
            />
            <Route path="/reset-password/:token" element={
                <Suspense fallback={<PageLoader />}>
                  <ResetPasswordForm />
                </Suspense>
              }
            />
            <Route path="/verify-email/:token" element={
                <Suspense fallback={<PageLoader />}>
                  <VerifyEmail />
                </Suspense>
              }
            />
            <Route path="/check-email" element={
                <Suspense fallback={<PageLoader />}>
                  <CheckEmail />
                </Suspense>
              }
            />
          </Route>

          {/* Callback OAuth Google — Supabase redirige ici après signInWithOAuth */}
          <Route path="/auth/callback" element={
            <Suspense fallback={<PageLoader />}>
              <OAuthCallback />
            </Suspense>
          } />

          {/* Route sélection de rôle après inscription Google */}
          <Route element={<AuthProtectedRoute />}>
            <Route path="/auth/role-selection" element={
              <Suspense fallback={<PageLoader />}>
                <GoogleRoleSelection />
              </Suspense>
            } />
          </Route>

          {/* Route 404 */}
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <Error404 />
            </Suspense>
          } />
          <Route path="/404" element={
            <Suspense fallback={<PageLoader />}>
              <Error404 />
            </Suspense>
          } />
        </Route>
      </Routes>
    </>
  );
}
