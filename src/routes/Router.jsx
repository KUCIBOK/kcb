import { lazy, Suspense } from "react";
import { PageLoader } from "../components/loaders/PageLoader";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { Layout } from "../pages/Layout";
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const CheckEmail = lazy(() => import("../pages/auth/CheckEmail"));
const ResetPasswordForm = lazy(() => import("../pages/ForgotPassword"));
const ForgotPasswordForm = lazy(() => import("../pages/ForgotPasswordForm"));
const About = lazy(() => import("../pages/About"));
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
const BuyerAccount = lazy(() => import("../pages/dashboard/BuyerAccount"));
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
const Unsubscribe = lazy(() => import("../pages/Unsubscribe"));
const TrackingPage = lazy(() => import("../pages/TrackingPage"));
const AfricaLanding = lazy(() => import("../pages/AfricaLanding"));
const AfricaCataloguePage = lazy(() => import("../pages/AfricaCataloguePage"));
import PortalLayout from "../components/landing/PortalLayout";

/**
 * Wraps any page component inside the Africa PortalLayout (gold nav + footer).
 * Adds top padding to compensate for the fixed PortalNav.
 */
function AfricaWrap({ children }) {
  return (
    <PortalLayout portal="africa">
      <div className="pt-24">{children}</div>
    </PortalLayout>
  )
}

/**
 * Wraps any page component inside the Global PortalLayout (silver nav + footer).
 * Adds top padding to compensate for the fixed PortalNav.
 */
function GlobalWrap({ children }) {
  return (
    <PortalLayout portal="global">
      <div className="pt-24">{children}</div>
    </PortalLayout>
  )
}

/**
 * Redirect helper for routes with dynamic :id params.
 * Replaces :id in the target path with the actual param value.
 */
function NavigateWithParams({ to }) {
  const params = useParams()
  let target = to
  for (const [key, value] of Object.entries(params)) {
    if (key !== "*") target = target.replace(`:${key}`, value)
  }
  return <Navigate to={target} replace />
}
const GatewayPage = lazy(() => import("../pages/GatewayPage"));
const GlobalPage          = lazy(() => import("../pages/GlobalPage"))
const GlobalCataloguePage = lazy(() => import("../pages/GlobalCataloguePage"))
const GlobalSourcingPage  = lazy(() => import("../pages/GlobalSourcingPage"))
const VerifyArtwork = lazy(() => import("../pages/VerifyArtwork"));
const CataloguePro = lazy(() => import("../pages/CataloguePro"));
// Protected Routes
import { GuestProtectedRoute } from "../utils/GuestProtectedRoute";
import { ArtistProtectedRoute } from "../utils/ArtistProtectedRoute";
import { BuyerProtectedRoute } from "../utils/BuyerProtectedRoute";
import { CuratorProtectedRoute } from "../utils/CuratorProtectedRoute";
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
import { ErrorBoundary } from "react-error-boundary";
import Error500 from "../components/fallback/Error500";

export function Router() {
  return (
    <>
      <Routes>
        <Route
          element={
            <ErrorBoundary FallbackComponent={Error500}>
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
            </ErrorBoundary>
          }
        >
          {/* Gateway — standalone split-screen entry */}
          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              <GatewayPage />
            </Suspense>
          } />

          {/* Layout — pages utilitaires (paiement, tracking, legal) */}
          <Route element={<Layout />}>
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
          </Route>

          {/* Redirections — anciennes routes vers le portail Africa par défaut */}
          <Route path="/explore" element={<Navigate to="/africa/catalogue" replace />} />
          <Route path="/explore/:category" element={<Navigate to="/africa/catalogue" replace />} />
          <Route path="/marketplace" element={<Navigate to="/africa/catalogue" replace />} />
          <Route path="/artists" element={<Navigate to="/africa/artists" replace />} />
          <Route path="/artist/:id" element={<NavigateWithParams to="/africa/artist/:id" />} />
          <Route path="/artwork/:id" element={<NavigateWithParams to="/africa/artwork/:id" />} />
          <Route path="/blog" element={<Navigate to="/africa/blog" replace />} />
          <Route path="/blog/:id" element={<NavigateWithParams to="/africa/blog/:id" />} />
          <Route path="/about" element={<Navigate to="/africa/about" replace />} />
          <Route path="/contact" element={<Navigate to="/africa/contact" replace />} />
          <Route path="/faq" element={<Navigate to="/africa/faq" replace />} />

          {/* Pages standalone — avec leur propre header/footer, hors Layout */}
          <Route path="/africa" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaLanding />
            </Suspense>
          } />
          <Route path="/africa/catalogue" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaCataloguePage />
            </Suspense>
          } />
          <Route path="/africa/artists" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><Artists /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/africa/artist/:id" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><ArtistDetails /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/africa/artwork/:id" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><Artwork /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/africa/blog" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><Blog /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/africa/blog/:id" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><BlogPostDetails /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/africa/about" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><About /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/africa/faq" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><Faq /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/africa/contact" element={
            <Suspense fallback={<PageLoader />}>
              <AfricaWrap><Contact /></AfricaWrap>
            </Suspense>
          } />
          <Route path="/global" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalPage />
            </Suspense>
          } />
          <Route path="/global/catalogue" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalCataloguePage />
            </Suspense>
          } />
          <Route path="/global/sourcing" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalSourcingPage />
            </Suspense>
          } />
          <Route path="/global/artists" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><Artists /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/global/artist/:id" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><ArtistDetails /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/global/artwork/:id" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><Artwork /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/global/blog" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><Blog /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/global/blog/:id" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><BlogPostDetails /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/global/about" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><About /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/global/faq" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><Faq /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/global/contact" element={
            <Suspense fallback={<PageLoader />}>
              <GlobalWrap><Contact /></GlobalWrap>
            </Suspense>
          } />
          <Route path="/unsubscribe" element={
            <Suspense fallback={<PageLoader />}>
              <Unsubscribe />
            </Suspense>
          } />
          {/* Standard Kucibok — vérification publique (scannable via QR, sans auth) */}
          <Route path="/verify/:kucibokId" element={
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

          {/* Buyer account — lightweight page */}
          <Route path="/account" element={<BuyerProtectedRoute />}>
            <Route path="" element={
                <Suspense fallback={<PageLoader />}>
                  <BuyerAccount />
                </Suspense>
              }
            />
          </Route>

          {/* Redirect old collector dashboard to /account */}
          <Route path="/dashboard/collector" element={<Navigate to="/account" replace />} />

          {/* Curator protected routes (replaces professional) */}
          <Route
            path="/dashboard/curator"
            element={<CuratorProtectedRoute />}
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

          {/* Redirect old professional dashboard to curator */}
          <Route path="/dashboard/professional" element={<Navigate to="/dashboard/curator" replace />} />

          {/* F3 — Catalogue certifié (curator + admin) */}
          <Route path="/catalogue" element={<CuratorProtectedRoute />}>
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
            <Route path="/reset-password" element={
                <Suspense fallback={<PageLoader />}>
                  <ResetPasswordForm />
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
